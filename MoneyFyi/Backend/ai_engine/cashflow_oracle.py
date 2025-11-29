import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
from statistics import mean, stdev


class CashflowOracle:
    
    
    def __init__(self):
        self.analysis_cache = {}
    
    def predict(
        self, 
        transactions: List[Dict[str, Any]], 
        current_balance: float
    ) -> Dict[str, Any]:
       
        credits = [t for t in transactions if t.get('type') == 'credit' or t.get('amount', 0) > 0]
        debits = [t for t in transactions if t.get('type') == 'debit' or t.get('amount', 0) < 0]
        
        avg_weekly_income = self._calculate_weekly_average(credits)
        avg_weekly_expense = self._calculate_weekly_average(debits)
        
        
        net_weekly = avg_weekly_income - abs(avg_weekly_expense)
        
        forecast_7d = self._generate_forecast(current_balance, net_weekly, days=7)
        forecast_30d = self._generate_forecast(current_balance, net_weekly, days=30)
        
        min_balance_7d = min([f['predicted_balance'] for f in forecast_7d])
        min_balance_30d = min([f['predicted_balance'] for f in forecast_30d])
        
        stress_level = self._calculate_stress_level(min_balance_30d, avg_weekly_expense)
        
        insights = self._generate_insights(
            current_balance,
            net_weekly,
            min_balance_7d,
            min_balance_30d,
            avg_weekly_income,
            avg_weekly_expense,
            stress_level
        )
        
        risks = self._identify_risks(forecast_30d, avg_weekly_expense)
        
        return {
            "current_balance": current_balance,
            "7_day_forecast": forecast_7d,
            "30_day_forecast": forecast_30d,
            "cashflow_stress": stress_level,
            "avg_weekly_income": round(avg_weekly_income, 2),
            "avg_weekly_expense": round(abs(avg_weekly_expense), 2),
            "net_weekly_change": round(net_weekly, 2),
            "insights": insights,
            "risks": risks,
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def _calculate_weekly_average(self, transactions: List[Dict]) -> float:
        """Calculate average weekly transaction amount"""
        if not transactions:
            return 0.0
        
        recent_txns = sorted(transactions, key=lambda x: x.get('date', ''), reverse=True)[:28]
        
        if not recent_txns:
            return 0.0
        
        total = sum(abs(t.get('amount', 0)) for t in recent_txns)
        weeks = len(recent_txns) / 7 if len(recent_txns) > 0 else 1
        
        return total / weeks if weeks > 0 else 0.0
    
    def _generate_forecast(
        self, 
        current_balance: float, 
        net_weekly_change: float, 
        days: int
    ) -> List[Dict]:
        """Generate day-by-day balance forecast"""
        forecast = []
        balance = current_balance
        daily_change = net_weekly_change / 7
        
        for day in range(1, days + 1):
            balance += daily_change
            
            variance = daily_change * 0.05
            predicted = balance + (variance if day % 3 == 0 else -variance)
            
            forecast.append({
                "day": day,
                "date": (datetime.now() + timedelta(days=day)).strftime("%Y-%m-%d"),
                "predicted_balance": round(predicted, 2),
                "confidence": self._calculate_confidence(day)
            })
        
        return forecast
    
    def _calculate_confidence(self, days_ahead: int) -> str:
        """ forecast confidence depending on how far ahead"""
        if days_ahead <= 7:
            return "high"
        elif days_ahead <= 14:
            return "medium"
        else:
            return "low"
    
    def _calculate_stress_level(
        self, 
        min_predicted_balance: float, 
        avg_weekly_expense: float
    ) -> str:
        """cashflow stress level"""
        critical_threshold = abs(avg_weekly_expense) * 0.5 
        warning_threshold = abs(avg_weekly_expense) * 2  
        
        if min_predicted_balance < critical_threshold:
            return "high"
        elif min_predicted_balance < warning_threshold:
            return "medium"
        else:
            return "low"
    
    def _generate_insights(
        self,
        current_balance: float,
        net_weekly: float,
        min_7d: float,
        min_30d: float,
        income: float,
        expense: float,
        stress: str
    ) -> List[str]:
        """Generate actionable insights"""
        insights = []
        
        if net_weekly < 0:
            insights.append(f" Negative cashflow trend: Spending ₹{abs(net_weekly):,.0f} more than earning per week")
        elif net_weekly > 0:
            insights.append(f" Positive cashflow: Surplus of ₹{net_weekly:,.0f} per week")
        else:
            insights.append("Breaking even: Income matches expenses")
        
        if min_7d < current_balance * 0.5:
            insights.append(f"Balance may drop 50% in next 7 days (to ₹{min_7d:,.0f})")
        
        if min_30d < 0:
            insights.append(f"CRITICAL: Predicted negative balance in 30 days (₹{min_30d:,.0f})")
        
        if stress == "high":
            insights.append("HIGH STRESS: Delay non-essential payments immediately")
            insights.append(f" Need to reduce weekly expenses by at least ₹{abs(net_weekly):,.0f}")
        elif stress == "medium":
            insights.append("MODERATE STRESS: Monitor large payments carefully")
        else:
            insights.append(" Healthy cashflow: Safe to make planned payments")
        
        if income > 0:
            expense_ratio = (abs(expense) / income) * 100
            if expense_ratio > 90:
                insights.append(f"High burn rate: Spending {expense_ratio:.0f}% of income")
        
        return insights
    
    def _identify_risks(
        self, 
        forecast: List[Dict], 
        avg_expense: float
    ) -> List[Dict]:
        """Identify specific risk periods"""
        risks = []
        
        for i, day in enumerate(forecast):
            balance = day['predicted_balance']
            
            if balance < abs(avg_expense):
                risks.append({
                    "day": day['day'],
                    "date": day['date'],
                    "risk_type": "LOW_BALANCE",
                    "severity": "high" if balance < abs(avg_expense) * 0.5 else "medium",
                    "description": f"Balance drops to ₹{balance:,.0f} - below safety threshold"
                })
            
            if balance < 0:
                risks.append({
                    "day": day['day'],
                    "date": day['date'],
                    "risk_type": "NEGATIVE_BALANCE",
                    "severity": "critical",
                    "description": f"Predicted overdraft: ₹{balance:,.0f}"
                })
        
        return risks
    
    def get_recommendation(self, analysis: Dict) -> str:
        """Get overall recommendation based on analysis"""
        stress = analysis['cashflow_stress']
        net_change = analysis['net_weekly_change']
        
        if stress == "high":
            return " CRITICAL: Freeze all non-essential payments. Seek immediate funding or negotiate payment terms."
        elif stress == "medium":
            return " CAUTION: Prioritize essential payments only. Consider deferring large expenses."
        else:
            if net_change > 0:
                return " HEALTHY: Safe to proceed with planned payments and investments."
            else:
                return " STABLE: Monitor expenses but no immediate concerns."


if __name__ == "__main__":
    oracle = CashflowOracle()
    
    sample_transactions = [
        {"date": "2025-09-01", "amount": 50000, "type": "credit"},
        {"date": "2025-09-05", "amount": -12000, "type": "debit"},
        {"date": "2025-09-10", "amount": -8000, "type": "debit"},
        {"date": "2025-09-15", "amount": 60000, "type": "credit"},
        {"date": "2025-09-20", "amount": -15000, "type": "debit"},
        {"date": "2025-10-01", "amount": 55000, "type": "credit"},
        {"date": "2025-10-05", "amount": -18000, "type": "debit"},
        {"date": "2025-10-10", "amount": -9000, "type": "debit"},
        {"date": "2025-10-15", "amount": 58000, "type": "credit"},
        {"date": "2025-11-01", "amount": 52000, "type": "credit"},
        {"date": "2025-11-05", "amount": -20000, "type": "debit"},
        {"date": "2025-11-10", "amount": -11000, "type": "debit"},
    ]
    
    current_balance = 75000
    
    result = oracle.predict(sample_transactions, current_balance)
    
    print("=" * 60)
    print("CASHFLOW ORACLE PREDICTION")
    print("=" * 60)
    print(f"\nCurrent Balance: ₹{result['current_balance']:,.0f}")
    print(f"Cashflow Stress: {result['cashflow_stress'].upper()}")
    print(f"\nAvg Weekly Income: ₹{result['avg_weekly_income']:,.0f}")
    print(f"Avg Weekly Expense: ₹{result['avg_weekly_expense']:,.0f}")
    print(f"Net Weekly Change: ₹{result['net_weekly_change']:,.0f}")
    
    print("\n 7-Day Forecast (sample):")
    for day in result['7_day_forecast'][:3]:
        print(f"  Day {day['day']}: ₹{day['predicted_balance']:,.0f} ({day['confidence']} confidence)")
    
    print("\n Insights:")
    for insight in result['insights']:
        print(f"  {insight}")
    
    if result['risks']:
        print(f"\n Risks Identified: {len(result['risks'])}")