import sys
import os
from pathlib import Path
from typing import Dict, List, Any

# Add the parent directory to sys.path to allow importing ai_engine
# Assuming structure: Backend/app/services/ai_service.py -> Backend/ai_engine
backend_root = Path(__file__).parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.append(str(backend_root))

try:
    from ai_engine.integration import MoneyFyiAI
except ImportError:
    # Fallback for when running from different contexts
    try:
        sys.path.append(os.path.join(os.getcwd(), "ai_engine"))
        from integration import MoneyFyiAI
    except ImportError:
        print("CRITICAL: Could not import ai_engine. Make sure it exists in the Backend directory.")
        raise

class AIService:
    def __init__(self):
        self.engine = MoneyFyiAI()

    def analyze_transaction(
        self,
        transaction: Dict[str, Any],
        transaction_history: List[Dict[str, Any]],
        vendor_history: Dict[str, Any],
        current_balance: float
    ) -> Dict[str, Any]:
        """
        Run the full AI analysis pipeline on a single transaction.
        """
        return self.engine.analyze_full(
            raw_transaction=transaction,
            transaction_history=transaction_history,
            vendor_history=vendor_history,
            current_balance=current_balance
        )

    def analyze_batch(
        self,
        transactions: List[Dict[str, Any]],
        transaction_history: List[Dict[str, Any]],
        vendor_history: Dict[str, Any],
        current_balance: float
    ) -> Dict[str, Any]:
        """
        Run batch analysis on multiple transactions.
        """
        return self.engine.analyze_batch(
            raw_transactions=transactions,
            transaction_history=transaction_history,
            vendor_history=vendor_history,
            current_balance=current_balance
        )

# Singleton instance
ai_service = AIService()
