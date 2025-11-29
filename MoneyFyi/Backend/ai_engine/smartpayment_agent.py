import json
from datetime import datetime
from typing import Dict, List, Any


class SmartPaymentAgent:
    def __init__(self):
        self.decision_history = []
    
    def recommend(
        self,
        transaction: Dict[str, Any],
        fraud_analysis: Dict[str, Any],
        cashflow_analysis: Dict[str, Any],
        vendor_history: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        vendor = transaction.get('vendor', 'Unknown')
        amount = transaction.get('amount', 0)
        
        
        reasons = []
        payment_safety_score = 100 
        
        
        fraud_score = fraud_analysis.get('fraud_score', 0)
        fraud_risk = fraud_analysis.get('risk_level', 'low')
        
        if fraud_score >= 70:
            payment_safety_score -= 40
            reasons.append(f" High fraud risk detected (score: {fraud_score}/100)")
        elif fraud_score >= 40:
            payment_safety_score -= 20
            reasons.append(f" Moderate fraud risk (score: {fraud_score}/100)")
        elif fraud_score >= 20:
            payment_safety_score -= 10
            reasons.append(f" Minor fraud indicators present")
        
        
        fraud_flags = fraud_analysis.get('flags', [])
        if 'NEW_VENDOR' in fraud_flags:
            reasons.append("First-time vendor - requires verification")
        if 'DUPLICATE_UTR' in fraud_flags:
            reasons.append("Duplicate payment detected - DO NOT PAY")
            payment_safety_score -= 50 
        
        cashflow_stress = cashflow_analysis.get('cashflow_stress', 'low')
        net_weekly = cashflow_analysis.get('net_weekly_change', 0)
        
        if cashflow_stress == "high":
            payment_safety_score -= 30
            reasons.append(f" Critical cashflow stress - balance declining")
        elif cashflow_stress == "medium":
            payment_safety_score -= 15
            reasons.append(f"Moderate cashflow pressure")
        
        if net_weekly < 0:
            payment_safety_score -= 10
            reasons.append(f"Negative cashflow trend: -₹{abs(net_weekly):,.0f}/week")
        
        vendor_data = vendor_history.get(vendor, {})
        vendor_trust = vendor_data.get('trust_score', 50)
        vendor_frequency = vendor_data.get('frequency', 0)
        
        if vendor_trust < 30:
            payment_safety_score -= 20
            reasons.append(f"Very low vendor trust score ({vendor_trust}/100)")
        elif vendor_trust < 50:
            payment_safety_score -= 10
            reasons.append(f"Below-average vendor trust ({vendor_trust}/100)")
        
        if vendor_frequency == 0:
            payment_safety_score -= 5
            reasons.append("No previous payment history with vendor")
        
        current_balance = cashflow_analysis.get('current_balance', 0)
        
        if current_balance > 0:
            balance_impact = (amount / current_balance) * 100
            
            if balance_impact > 80:
                payment_safety_score -= 25
                reasons.append(f" Payment consumes {balance_impact:.0f}% of available balance")
            elif balance_impact > 50:
                payment_safety_score -= 15
                reasons.append(f"Payment is {balance_impact:.0f}% of current balance")
            elif balance_impact > 30:
                payment_safety_score -= 5
                reasons.append(f"Significant payment ({balance_impact:.0f}% of balance)")
        
        forecast_7d = cashflow_analysis.get('7_day_forecast', [])
        if forecast_7d:
            min_future_balance = min([day['predicted_balance'] for day in forecast_7d])
            balance_after_payment = min_future_balance - amount
            
            if balance_after_payment < 0:
                payment_safety_score -= 15
                reasons.append(f"Payment would cause overdraft in next 7 days")
            elif balance_after_payment < 10000:
                payment_safety_score -= 10
                reasons.append(f"Payment leaves critically low balance (₹{balance_after_payment:,.0f})")
        
       
        recommendation, suggested_pct = self._determine_recommendation(
            payment_safety_score,
            fraud_risk,
            cashflow_stress,
            amount
        )
        
        
        positive_factors = self._get_positive_factors(
            fraud_score,
            vendor_trust,
            vendor_frequency,
            cashflow_stress
        )
        
      
        alternatives = self._generate_alternatives(
            recommendation,
            amount,
            cashflow_stress,
            fraud_risk,
            vendor_trust
        )
        
        
        decision = {
            "transaction_id": transaction.get('id', 'unknown'),
            "vendor": vendor,
            "amount": amount,
            "recommendation": recommendation,
            "payment_safety_score": max(0, payment_safety_score),  
            "suggested_pct": suggested_pct,
            "suggested_amount": round(amount * (suggested_pct / 100), 2),
            "risk_factors": reasons,
            "positive_factors": positive_factors,
            "alternative_actions": alternatives,
            "confidence": self._calculate_confidence(payment_safety_score),
            "timestamp": datetime.now().isoformat()
        }
        
        self.decision_history.append(decision)
        
        return decision
    
    def _determine_recommendation(
        self,
        safety_score: float,
        fraud_risk: str,
        cashflow_stress: str,
        amount: float
    ) -> tuple:
        """Determine the final recommendation and the payment percentage"""
        
        if fraud_risk == "high":
            return "AVOID", 0
        
        if cashflow_stress == "high" and amount > 50000:
            return "AVOID", 0
        
        
        if safety_score >= 70:
            return "PAY_FULL", 100
        elif safety_score >= 45:
            pct = int((safety_score - 45) / 25 * 50) + 50 
            return "PAY_PARTIALLY", pct
        elif safety_score >= 25:
            return "PAY_PARTIALLY", 30
        else:
            return "AVOID", 0
    
    def _get_positive_factors(
        self,
        fraud_score: float,
        vendor_trust: float,
        vendor_frequency: int,
        cashflow_stress: str
    ) -> List[str]:
        """Identify the +ve factors supporting payment"""
        positives = []
        
        if fraud_score < 20:
            positives.append("No significant fraud indicators")
        
        if vendor_trust >= 80:
            positives.append(f" High vendor trust score ({vendor_trust}/100)")
        
        if vendor_frequency >= 5:
            positives.append(f" Established vendor relationship ({vendor_frequency} transactions)")
        
        if cashflow_stress == "low":
            positives.append("Healthy cashflow situation")
        
        if not positives:
            positives.append("Proceed with caution")
        
        return positives
    
    def _generate_alternatives(
        self,
        recommendation: str,
        amount: float,
        cashflow_stress: str,
        fraud_risk: str,
        vendor_trust: float
    ) -> List[str]:
        """ alternative payment strategies"""
        alternatives = []
        
        if recommendation == "AVOID":
            if fraud_risk == "high":
                alternatives.append(" Verify vendor identity through independent channels")
                alternatives.append(" Contact vendor directly to confirm transaction legitimacy")
                alternatives.append(" Request additional documentation before payment")
            
            if cashflow_stress == "high":
                alternatives.append("Negotiate extended payment terms (30-60 days)")
                alternatives.append(" Request invoice splitting into smaller payments")
                alternatives.append(" Explore alternative payment methods or credit lines")
        
        elif recommendation == "PAY_PARTIALLY":
            alternatives.append(f" Pay ₹{amount * 0.3:,.0f} now, balance in 15 days")
            alternatives.append("Negotiate milestone-based payments")
            alternatives.append(" Discuss early payment discount for reduced amount")
        
        elif recommendation == "PAY_FULL":
            if vendor_trust < 70:
                alternatives.append("Ensure proper documentation and receipts")
            alternatives.append("Consider using payment method with dispute protection")
        
        return alternatives
    
    def _calculate_confidence(self, safety_score: float) -> str:
        """Calc confidence level in recommendation"""
        if safety_score >= 70 or safety_score <= 25:
            return "high" 
        else:
            return "medium"  
    def get_summary(self) -> Dict:
        """summary of all recommendations made"""
        if not self.decision_history:
            return {"total_decisions": 0}
        
        total = len(self.decision_history)
        pay_full = sum(1 for d in self.decision_history if d['recommendation'] == 'PAY_FULL')
        pay_partial = sum(1 for d in self.decision_history if d['recommendation'] == 'PAY_PARTIALLY')
        avoid = sum(1 for d in self.decision_history if d['recommendation'] == 'AVOID')
        
        avg_score = sum(d['payment_safety_score'] for d in self.decision_history) / total
        
        return {
            "total_decisions": total,
            "pay_full_count": pay_full,
            "pay_partially_count": pay_partial,
            "avoid_count": avoid,
            "average_safety_score": round(avg_score, 2),
            "risk_prevention_rate": round((avoid / total) * 100, 1) if total > 0 else 0
        }


if __name__ == "__main__":
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TXN_001",
        "vendor": "Suspicious Supplier Co",
        "amount": 45000,
        "due_date": "2025-11-20"
    }
    
    fraud_analysis = {
        "fraud_score": 65,
        "risk_level": "medium",
        "flags": ["NEW_VENDOR", "UNUSUAL_AMOUNT"],
        "reasoning": ["First transaction", "Amount 3x higher"]
    }
    
    cashflow_analysis = {
        "current_balance": 52000,
        "cashflow_stress": "medium",
        "net_weekly_change": -5000,
        "7_day_forecast": [
            {"day": 1, "predicted_balance": 50000},
            {"day": 7, "predicted_balance": 35000}
        ]
    }
    
    vendor_history = {
        "Suspicious Supplier Co": {
            "trust_score": 45,
            "frequency": 0,
            "avg_amount": 0
        }
    }
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
    print("=" * 60)
    print("SMARTPAYMENT RECOMMENDATION")
    print("=" * 60)
    print(f"\n Vendor: {result['vendor']}")
    print(f"Amount: ₹{result['amount']:,.0f}")
    print(f"\n RECOMMENDATION: {result['recommendation']}")
    print(f"Payment Safety Score: {result['payment_safety_score']}/100")
    print(f"Suggested Amount: ₹{result['suggested_amount']:,.0f} ({result['suggested_pct']}%)")
    
    print("\n PossibleRisk Factors:")
    for reason in result['risk_factors']:
        print(f"  {reason}")
    
    print("\nPositive Factors:")
    for factor in result['positive_factors']:
        print(f"  {factor}")
    
    print("\nAlternative Actions:")
    for alt in result['alternative_actions']:
        print(f"  {alt}")