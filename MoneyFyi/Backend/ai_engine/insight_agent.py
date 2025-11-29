

import json
from datetime import datetime
from typing import Dict, List, Any


class InsightAgent:
    """
    Synthesizes outputs from:
    - FraudGuard Agent
    - Cashflow Oracle
    - Compliance Mate Agent
    - SmartPayment Agent
    
    Into final actionable insights and recommendations
    """
    
    def __init__(self):
        self.priority_matrix = {
            "CRITICAL": 100,
            "HIGH": 80,
            "MEDIUM": 50,
            "LOW": 20
        }
    
    def generate(
        self,
        fraud_analysis: Dict[str, Any],
        cashflow_analysis: Dict[str, Any],
        compliance_analysis: Dict[str, Any],
        payment_recommendation: Dict[str, Any],
        transaction: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Main insight generation function
        
        Args:
            fraud_analysis: Output from FraudGuard
            cashflow_analysis: Output from Cashflow Oracle
            compliance_analysis: Output from Compliance Mate
            payment_recommendation: Output from SmartPayment
            transaction: Original transaction details
            
        Returns:
            Comprehensive insights with priority alerts and final recommendation
        """
        
        fraud_score = fraud_analysis.get('fraud_score', 0)
        fraud_risk = fraud_analysis.get('risk_level', 'low')
        fraud_flags = fraud_analysis.get('flags', [])
        
        cashflow_stress = cashflow_analysis.get('cashflow_stress', 'low')
        net_weekly = cashflow_analysis.get('net_weekly_change', 0)
        
        compliance_severity = compliance_analysis.get('severity', 'none')
        compliance_flags = compliance_analysis.get('compliance_flags', [])
        
        payment_rec = payment_recommendation.get('recommendation', 'PAY_FULL')
        payment_score = payment_recommendation.get('payment_safety_score', 100)
        
        final_risk = self._calculate_final_risk(
            fraud_score,
            cashflow_stress,
            payment_score,
            compliance_severity
        )
        
        priority_alerts = self._generate_priority_alerts(
            fraud_analysis,
            cashflow_analysis,
            compliance_analysis,
            payment_recommendation,
            final_risk
        )
        
        insights = self._generate_comprehensive_insights(
            fraud_analysis,
            cashflow_analysis,
            compliance_analysis,
            payment_recommendation,
            transaction
        )
        
        final_action = self._determine_final_action(
            fraud_risk,
            cashflow_stress,
            compliance_severity,
            payment_rec,
            final_risk
        )
        
        executive_summary = self._generate_executive_summary(
            final_risk,
            final_action,
            priority_alerts,
            transaction
        )
        
        action_plan = self._create_action_plan(
            fraud_analysis,
            cashflow_analysis,
            compliance_analysis,
            payment_recommendation
        )
        
        return {
            "transaction_id": transaction.get('id', 'unknown'),
            "vendor": transaction.get('vendor', 'Unknown'),
            "amount": transaction.get('amount', 0),
            "final_risk_score": final_risk,
            "final_action": final_action,
            "executive_summary": executive_summary,
            "priority_alerts": priority_alerts,
            "insights": insights,
            "action_plan": action_plan,
            "analysis_breakdown": {
                "fraud_score": fraud_score,
                "fraud_risk": fraud_risk,
                "cashflow_stress": cashflow_stress,
                "compliance_severity": compliance_severity,
                "payment_safety_score": payment_score
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def _calculate_final_risk(
        self,
        fraud_score: float,
        cashflow_stress: str,
        payment_score: float,
        compliance_severity: str
    ) -> int:
        """
        Calculate weighted final risk score (0-100)
        
        Weights:
        - Fraud: 40%
        - Cashflow: 30%
        - Payment: 20%
        - Compliance: 10%
        """
        
        cashflow_map = {'low': 20, 'medium': 50, 'high': 80}
        cashflow_score = cashflow_map.get(cashflow_stress, 50)
        
        compliance_map = {'none': 0, 'low': 25, 'medium': 50, 'high': 80}
        compliance_score = compliance_map.get(compliance_severity, 25)
        
        payment_risk = 100 - payment_score
        
        final = (
            fraud_score * 0.40 +
            cashflow_score * 0.30 +
            payment_risk * 0.20 +
            compliance_score * 0.10
        )
        
        return int(final)
    
    def _generate_priority_alerts(
        self,
        fraud: Dict,
        cashflow: Dict,
        compliance: Dict,
        payment: Dict,
        final_risk: int
    ) -> List[Dict[str, str]]:
        """Generate ordered priority alerts (top 5 most critical)"""
        alerts = []
        
        if 'DUPLICATE_UTR' in fraud.get('flags', []):
            alerts.append({
                "priority": "CRITICAL",
                "category": "FRAUD",
                "message": " DUPLICATE PAYMENT DETECTED - Same UTR already used",
                "action": "BLOCK PAYMENT IMMEDIATELY"
            })
        
        if 'FAKE_GSTIN' in compliance.get('compliance_flags', []):
            alerts.append({
                "priority": "CRITICAL",
                "category": "COMPLIANCE",
                "message": " FAKE GSTIN DETECTED - Vendor using dummy GST number",
                "action": "Verify vendor credentials before payment"
            })
        
        risks = cashflow.get('risks', [])
        negative_balance = any(r.get('risk_type') == 'NEGATIVE_BALANCE' for r in risks)
        if negative_balance:
            alerts.append({
                "priority": "HIGH",
                "category": "CASHFLOW",
                "message": " NEGATIVE BALANCE PREDICTED - Account will overdraft within 30 days",
                "action": "Defer non-essential payments immediately"
            })
        
        if fraud.get('fraud_score', 0) >= 70:
            alerts.append({
                "priority": "HIGH",
                "category": "FRAUD",
                "message": f" HIGH FRAUD RISK - Score: {fraud.get('fraud_score')}/100",
                "action": "Conduct additional verification checks"
            })
        
        if cashflow.get('cashflow_stress') == 'high':
            alerts.append({
                "priority": "HIGH",
                "category": "CASHFLOW",
                "message": " CRITICAL CASHFLOW STRESS - Operating funds dangerously low",
                "action": "Prioritize only essential payments"
            })
        
        if 'MSME_45DAY_VIOLATION' in compliance.get('compliance_flags', []):
            alerts.append({
                "priority": "MEDIUM",
                "category": "COMPLIANCE",
                "message": " MSME PAYMENT OVERDUE - Interest penalty applicable",
                "action": "Process payment urgently to avoid legal issues"
            })
        
        tds_flags = [f for f in compliance.get('compliance_flags', []) if 'TDS_REQUIRED' in f]
        if tds_flags:
            alerts.append({
                "priority": "MEDIUM",
                "category": "COMPLIANCE",
                "message": f" TDS DEDUCTION REQUIRED - {tds_flags[0]}",
                "action": "Deduct TDS before payment"
            })
        
        if 'NEW_VENDOR' in fraud.get('flags', []) and fraud.get('fraud_score', 0) >= 40:
            alerts.append({
                "priority": "MEDIUM",
                "category": "FRAUD",
                "message": " NEW VENDOR with ELEVATED AMOUNT",
                "action": "Verify vendor identity and credentials"
            })
        
        priority_order = ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
        alerts.sort(key=lambda x: priority_order.index(x['priority']))
        
        return alerts[:5]
    
    def _generate_comprehensive_insights(
        self,
        fraud: Dict,
        cashflow: Dict,
        compliance: Dict,
        payment: Dict,
        transaction: Dict
    ) -> List[str]:
        """Generate detailed insights from all agents"""
        insights = []
        
        if fraud.get('fraud_score', 0) > 0:
            insights.append(f"Fraud Analysis: Score {fraud['fraud_score']}/100 ({fraud['risk_level']} risk)")
            
            if fraud.get('flags'):
                flag_desc = ', '.join(fraud['flags'])
                insights.append(f"   Detected: {flag_desc}")
        
        # Cashflow insights
        net_change = cashflow.get('net_weekly_change', 0)
        if net_change < 0:
            insights.append(f" Cashflow Trend: Negative ₹{abs(net_change):,.0f}/week")
        else:
            insights.append(f"Cashflow Trend: Positive ₹{net_change:,.0f}/week surplus")
        
        insights.append(f"   Stress Level: {cashflow.get('cashflow_stress', 'unknown').upper()}")
        
        if compliance.get('compliance_flags'):
            insights.append(f"Compliance Issues: {len(compliance['compliance_flags'])} flag(s)")
            
            for flag in compliance['compliance_flags'][:3]:
                insights.append(f"   • {flag}")
        
        payment_rec = payment.get('recommendation', 'PAY_FULL')
        payment_score = payment.get('payment_safety_score', 100)
        
        if payment_rec == 'PAY_FULL':
            insights.append(f"Payment Recommendation: SAFE TO PAY (Score: {payment_score}/100)")
        elif payment_rec == 'PAY_PARTIALLY':
            suggested_pct = payment.get('suggested_pct', 50)
            insights.append(f"Payment Recommendation: PAY {suggested_pct}% ONLY (Score: {payment_score}/100)")
        else:
            insights.append(f" Payment Recommendation: AVOID (Score: {payment_score}/100)")
        
        amount = transaction.get('amount', 0)
        balance = cashflow.get('current_balance', 0)
        
        if amount > balance * 0.5:
            pct = (amount / balance * 100) if balance > 0 else 0
            insights.append(f"⚡ Transaction Impact: {pct:.0f}% of available balance")
        
        return insights
    
    def _determine_final_action(
        self,
        fraud_risk: str,
        cashflow_stress: str,
        compliance_severity: str,
        payment_rec: str,
        final_risk: int
    ) -> str:
        """Determine final recommended action with override logic"""
        
        if fraud_risk == 'high':
            return "AVOID"
        
        if compliance_severity == 'high':
            return "AVOID"
        
        if cashflow_stress == 'high' and final_risk >= 70:
            return "AVOID"
        
        risk_count = sum([
            fraud_risk == 'medium',
            cashflow_stress == 'medium',
            compliance_severity == 'medium'
        ])
        
        if risk_count >= 2 and final_risk >= 60:
            return "PAY_PARTIALLY"
        
        return payment_rec
    
    def _generate_executive_summary(
        self,
        final_risk: int,
        final_action: str,
        priority_alerts: List[Dict],
        transaction: Dict
    ) -> str:
        """Generate one-line executive summary"""
        
        vendor = transaction.get('vendor', 'Unknown Vendor')
        amount = transaction.get('amount', 0)
        
        if final_action == 'AVOID':
            if final_risk >= 80:
                return f" BLOCK PAYMENT: Critical risk detected for {vendor} (₹{amount:,.0f}). Risk score: {final_risk}/100."
            else:
                return f" DO NOT PAY: Multiple concerns identified for {vendor} (₹{amount:,.0f}). Review required."
        
        elif final_action == 'PAY_PARTIALLY':
            return f" PARTIAL PAYMENT ADVISED: Moderate risk for {vendor} (₹{amount:,.0f}). Risk score: {final_risk}/100."
        
        else:
            if final_risk <= 30:
                return f" APPROVED: Low risk transaction to {vendor} (₹{amount:,.0f}). Safe to proceed."
            else:
                return f" APPROVED: Transaction to {vendor} (₹{amount:,.0f}) cleared with minor notes. Risk score: {final_risk}/100."
    
    def _create_action_plan(
        self,
        fraud: Dict,
        cashflow: Dict,
        compliance: Dict,
        payment: Dict
    ) -> List[str]:
        """Create step-by-step action plan"""
        actions = []
        
        if 'DUPLICATE_UTR' in fraud.get('flags', []):
            actions.append("URGENT: Verify if previous payment with same UTR was processed")
            actions.append(" Contact vendor to clarify duplicate reference number")
        
        if 'NEW_VENDOR' in fraud.get('flags', []):
            actions.append(" Verify vendor identity through independent channels")
            actions.append(" Request additional documentation (GST cert, PAN, bank details)")
        
        if 'TDS_REQUIRED' in ' '.join(compliance.get('compliance_flags', [])):
            actions.append(" Calculate and deduct applicable TDS before payment")
            actions.append(" Generate TDS certificate and submit quarterly return")
        
        if 'MSME_45DAY_VIOLATION' in compliance.get('compliance_flags', []):
            actions.append(" Process MSME payment immediately to avoid further penalties")
            actions.append(" Calculate and pay interest for delayed payment")
        
        if cashflow.get('cashflow_stress') == 'high':
            actions.append(" Review all upcoming payments and defer non-essential items")
            actions.append(" Consider short-term financing or payment terms negotiation")
        
        if payment.get('recommendation') == 'PAY_PARTIALLY':
            suggested_pct = payment.get('suggested_pct', 50)
            actions.append(f" Negotiate partial payment of {suggested_pct}% with vendor")
            actions.append(f" Schedule remaining payment based on cashflow improvement")
        
        if not actions:
            actions.append(" Proceed with payment as per normal process")
            actions.append("Maintain proper documentation for audit trail")
        
        return actions[:5]  


if __name__ == "__main__":
    agent = InsightAgent()
    
    fraud_analysis = {
        "fraud_score": 65,
        "risk_level": "medium",
        "flags": ["NEW_VENDOR", "UNUSUAL_AMOUNT"],
        "reasoning": ["First transaction", "Amount 3x higher"]
    }
    
    cashflow_analysis = {
        "current_balance": 75000,
        "cashflow_stress": "medium",
        "net_weekly_change": -5000,
        "risks": [
            {"risk_type": "LOW_BALANCE", "day": 20}
        ]
    }
    
    compliance_analysis = {
        "compliance_flags": ["TDS_REQUIRED_194C"],
        "warnings": ["TDS deduction required"],
        "severity": "medium"
    }
    
    payment_recommendation = {
        "recommendation": "PAY_PARTIALLY",
        "payment_safety_score": 55,
        "suggested_pct": 50,
        "suggested_amount": 22500
    }
    
    transaction = {
        "id": "TXN_001",
        "vendor": "ABC Contractors",
        "amount": 45000
    }
    
    result = agent.generate(
        fraud_analysis,
        cashflow_analysis,
        compliance_analysis,
        payment_recommendation,
        transaction
    )
    
    print("=" * 70)
    print("INSIGHT AGENT - FINAL ANALYSIS")
    print("=" * 70)
    
    print(f"\nEXECUTIVE SUMMARY")
    print(f"{result['executive_summary']}")
    
    print(f"\n FINAL RISK SCORE: {result['final_risk_score']}/100")
    print(f" RECOMMENDED ACTION: {result['final_action']}")
    
    print(f"\n PRIORITY ALERTS:")
    for alert in result['priority_alerts']:
        print(f"\n[{alert['priority']}] {alert['category']}")
        print(f"  {alert['message']}")
        print(f"  {alert['action']}")
    
    print(f"\n KEY INSIGHTS:")
    for insight in result['insights']:
        print(f"  {insight}")
    
    print(f"\n ACTION PLAN:")
    for action in result['action_plan']:
        print(f"  {action}")