import json
from datetime import datetime
from typing import Dict, List, Any

# AI Agents
from data_normalizer_agent import DataNormalizerAgent
from fraudguard_agent import FraudGuardAgent
from cashflow_oracle import CashflowOracle
from smartpayment_agent import SmartPaymentAgent
from compliance_mate_agent import ComplianceMateAgent
from insight_agent import InsightAgent


class MoneyFyiAI:

    def __init__(self):
        self.normalizer = DataNormalizerAgent()
        self.fraudguard = FraudGuardAgent()
        self.cashflow_oracle = CashflowOracle()
        self.smartpayment = SmartPaymentAgent()
        self.compliance = ComplianceMateAgent()
        self.insight = InsightAgent()

    def analyze_full(
        self,
        raw_transaction: Dict[str, Any],
        transaction_history: List[Dict[str, Any]],
        vendor_history: Dict[str, Any],
        current_balance: float
    ) -> Dict[str, Any]:

        print(" Starting MoneyFyi Full Pipeline Analysis")

        print(" Normalizing data...")
        transaction = self.normalizer.normalize(raw_transaction)

        print(" Running FraudGuard...")
        fraud_analysis = self.fraudguard.analyze_transaction(
            transaction,
            vendor_history,
            transaction_history
        )

        print("  Running CashflowOracle...")
        cashflow_analysis = self.cashflow_oracle.predict(
            transaction_history,
            current_balance
        )

        print("Running SmartPaymentAgent...")
        payment_recommendation = self.smartpayment.recommend(
            transaction,
            fraud_analysis,
            cashflow_analysis,
            vendor_history
        )

        print(" Running ComplianceMateAgent...")
        compliance_analysis = self.compliance.check_compliance(
            transaction,
            vendor_history,
            transaction_history
        )


        print("  Running InsightAgent...")
        final_insight = self.insight.generate(
            fraud_analysis,
            cashflow_analysis,
            compliance_analysis,
            payment_recommendation,
            transaction
        )

        result = {
            "analysis_timestamp": datetime.now().isoformat(),

            "normalized_transaction": transaction,

            "fraud_analysis": fraud_analysis,
            "cashflow_analysis": cashflow_analysis,
            "payment_recommendation": payment_recommendation,
            "compliance_analysis": compliance_analysis,

            "final_insight": final_insight
        }

        print("\n COMPLETE — Full pipeline executed.\n")
        return result

    def analyze_batch(
        self,
        raw_transactions: List[Dict[str, Any]],
        transaction_history: List[Dict[str, Any]],
        vendor_history: Dict[str, Any],
        current_balance: float
    ) -> Dict[str, Any]:

        print(f"\n Running batch analysis for {len(raw_transactions)} transactions...\n")

        results = []
        for i, raw_txn in enumerate(raw_transactions):
            print(f"\n--- Processing Transaction {i+1}/{len(raw_transactions)} ---")
            result = self.analyze_full(
                raw_txn,
                transaction_history,
                vendor_history,
                current_balance
            )
            results.append(result)

        return {
            "batch_size": len(results),
            "results": results,
            "timestamp": datetime.now().isoformat()
        }

    def save_to_file(self, analysis: Dict, filename: str):
        with open(filename, 'w') as f:
            json.dump(analysis, f, indent=2)
        print(f"\n✓ Analysis saved to {filename}")


def load_sample_data():
    transaction = {
        "id": "TXN_001",
        "vendor": "ABC Electronics Ltd",
        "amount": "45,000",
        "date": "15-11-2025",
        "utr": "UTR987654321",
        "mode": "upi_payment",
        "type": "debit"
    }

    transaction_history = [
        {"date": "2025-09-01", "amount": 50000, "type": "credit", "vendor": "Client A"},
        {"date": "2025-09-05", "amount": -12000, "type": "debit", "vendor": "Regular Supplier A"},
        {"date": "2025-09-10", "amount": -8000, "type": "debit", "vendor": "Regular Supplier B"},
        # (...)
    ]

    vendor_history = {
        "Regular Supplier A": {"avg_amount": 12000, "frequency": 15, "trust_score": 90},
        "Regular Supplier B": {"avg_amount": 9000, "frequency": 10, "trust_score": 85},
        "ABC Electronics Ltd": {"avg_amount": 0, "frequency": 0, "trust_score": 50}
    }

    return transaction, transaction_history, vendor_history, 75000


if __name__ == "__main__":
    print("\n===== MoneyFYI AI TEST RUN =====\n")

    ai = MoneyFyiAI()
    txn, history, vendors, balance = load_sample_data()

    result = ai.analyze_full(
        raw_transaction=txn,
        transaction_history=history,
        vendor_history=vendors,
        current_balance=balance
    )

    ai.save_to_file(result, "sample_output.json")

    print("\n===== END =====\n")
