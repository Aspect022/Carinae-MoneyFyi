import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Set


class FraudGuardAgent:
   
    def __init__(self):
        self.seen_utrs: Set[str] = set()
        self.transaction_history: List[Dict] = []
        
    def analyze_transaction(
        self, 
        transaction: Dict[str, Any], 
        vendor_history: Dict[str, Any],
        all_transactions: List[Dict] = None
    ) -> Dict[str, Any]:
      
        flags = []
        reasons = []
        score = 0
        
        vendor = transaction.get('vendor', 'Unknown')
        amount = transaction.get('amount', 0)
        utr = transaction.get('utr', '')
        transaction_date = transaction.get('date', datetime.now().isoformat())
        
       
        self.transaction_history.append(transaction)
        
        
        if vendor not in vendor_history or vendor_history.get(vendor, {}).get('frequency', 0) == 0:
            flags.append("NEW_VENDOR")
            reasons.append(f"First time transacting with {vendor}")
            score += 25
        
        
        vendor_data = vendor_history.get(vendor, {})
        vendor_avg = vendor_data.get('avg_amount', 0)
        
        if vendor_avg > 0:
            amount_ratio = amount / vendor_avg
            if amount_ratio > 3:
                flags.append("UNUSUAL_AMOUNT")
                reasons.append(f"Amount ₹{amount:,.0f} is {amount_ratio:.1f}x higher than average ₹{vendor_avg:,.0f}")
                score += 30
            elif amount_ratio > 2:
                flags.append("ELEVATED_AMOUNT")
                reasons.append(f"Amount is {amount_ratio:.1f}x higher than usual")
                score += 15
        
        
        if utr:
            if utr in self.seen_utrs:
                flags.append("DUPLICATE_UTR")
                reasons.append(f"UTR {utr} has been used before - possible duplicate payment")
                score += 40
            else:
                self.seen_utrs.add(utr)
        
        
        if all_transactions:
            recent_count = self._count_recent_transactions(
                vendor, 
                transaction_date, 
                all_transactions,
                hours=1
            )
            
            if recent_count > 5:
                flags.append("HIGH_VELOCITY")
                reasons.append(f"{recent_count} transactions to {vendor} in last hour - possible attack")
                score += 25
            elif recent_count > 3:
                flags.append("ELEVATED_VELOCITY")
                reasons.append(f"{recent_count} transactions in short time period")
                score += 10
        
       
        if amount % 10000 == 0 and amount >= 50000:
            flags.append("ROUND_AMOUNT")
            reasons.append(f"Suspiciously round amount: ₹{amount:,.0f}")
            score += 10
        
        
        try:
            txn_datetime = datetime.fromisoformat(transaction_date.replace('Z', '+00:00'))
            hour = txn_datetime.hour
            weekday = txn_datetime.weekday()
            
            
            if weekday >= 5:
                flags.append("WEEKEND_TRANSACTION")
                reasons.append("Transaction on weekend - unusual for B2B")
                score += 5
            
            
            if hour >= 23 or hour <= 5:
                flags.append("LATE_NIGHT_TRANSACTION")
                reasons.append(f"Transaction at {hour}:00 - unusual timing")
                score += 10
        except:
            pass 
        
        
        if amount > 100000:
            flags.append("HIGH_VALUE")
            reasons.append(f"High value transaction: ₹{amount:,.0f}")
            score += 15
        
        
        if score >= 70:
            risk_level = "high"
        elif score >= 40:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "transaction_id": transaction.get('id', 'unknown'),
            "vendor": vendor,
            "amount": amount,
            "fraud_score": min(score, 100),  # Cap at 100
            "risk_level": risk_level,
            "flags": flags,
            "reasoning": reasons,
            "timestamp": datetime.now().isoformat(),
            "recommendation": self._get_recommendation(risk_level, score)
        }
    
    def _count_recent_transactions(
        self, 
        vendor: str, 
        current_date: str, 
        all_transactions: List[Dict],
        hours: int = 1
    ) -> int:
        """Count transactions to same vendor in recent time window"""
        try:
            current_dt = datetime.fromisoformat(current_date.replace('Z', '+00:00'))
            cutoff_time = current_dt - timedelta(hours=hours)
            
            count = 0
            for txn in all_transactions:
                if txn.get('vendor') == vendor:
                    txn_dt = datetime.fromisoformat(txn.get('date', '').replace('Z', '+00:00'))
                    if txn_dt >= cutoff_time and txn_dt <= current_dt:
                        count += 1
            
            return count
        except:
            return 0
    
    def _get_recommendation(self, risk_level: str, score: int) -> str:
        """Generate action recommendation based on risk"""
        if risk_level == "high":
            return "BLOCK - Verify vendor identity and transaction legitimacy before proceeding"
        elif risk_level == "medium":
            return "REVIEW - Additional verification recommended before payment"
        else:
            return "APPROVE - Transaction appears normal"
    
    def analyze_batch(
        self, 
        transactions: List[Dict], 
        vendor_history: Dict
    ) -> List[Dict]:
        """Analyze multiple transactions"""
        results = []
        
        for txn in transactions:
            result = self.analyze_transaction(txn, vendor_history, transactions)
            results.append(result)
        
        return results
    
    def get_summary_stats(self, analysis_results: List[Dict]) -> Dict:
        """Generate summary statistics from batch analysis"""
        total = len(analysis_results)
        high_risk = sum(1 for r in analysis_results if r['risk_level'] == 'high')
        medium_risk = sum(1 for r in analysis_results if r['risk_level'] == 'medium')
        low_risk = sum(1 for r in analysis_results if r['risk_level'] == 'low')
        
        avg_score = sum(r['fraud_score'] for r in analysis_results) / total if total > 0 else 0
        
        return {
            "total_analyzed": total,
            "high_risk_count": high_risk,
            "medium_risk_count": medium_risk,
            "low_risk_count": low_risk,
            "average_fraud_score": round(avg_score, 2),
            "high_risk_percentage": round((high_risk / total * 100), 1) if total > 0 else 0
        }


if __name__ == "__main__":
    agent = FraudGuardAgent()
    
    sample_txn = {
        "id": "TXN_001",
        "vendor": "Suspicious Electronics Ltd",
        "amount": 50000,
        "utr": "UTR123456789",
        "date": "2025-11-15T23:30:00Z",
        "mode": "UPI"
    }
    
    vendor_hist = {
        "Regular Supplier A": {
            "avg_amount": 15000,
            "frequency": 12,
            "trust_score": 90
        },
        "Regular Supplier B": {
            "avg_amount": 8000,
            "frequency": 8,
            "trust_score": 85
        }
    }
    
    result = agent.analyze_transaction(sample_txn, vendor_hist)
    
    print("=" * 60)
    print("FRAUDGUARD ANALYSIS RESULT")
    print("=" * 60)
    print(json.dumps(result, indent=2))