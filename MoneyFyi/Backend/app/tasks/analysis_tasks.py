import logging
from uuid import UUID
from datetime import datetime, timezone
from typing import List, Dict

from ..database import init_supabase_client
from ..services.ai_service import ai_service

logger = logging.getLogger("moneyfyi.backend.analysis")

async def analyze_transaction_task(transaction_id: str, user_id: UUID):
    """
    Background task to analyze a newly created transaction.
    Fetches history and context, runs AI engine, and updates the record.
    """
    logger.info(f"Starting AI analysis for transaction {transaction_id}")
    
    supabase = init_supabase_client()
    
    try:
        # 1. Fetch the target transaction
        txn_response = supabase.table("transactions").select("*").eq("id", transaction_id).execute()
        if not txn_response.data:
            logger.error(f"Transaction {transaction_id} not found")
            return
        
        transaction = txn_response.data[0]
        
        # 2. Fetch Transaction History (last 50 txns for context)
        # We need to convert these to the format expected by AI engine
        history_response = supabase.table("transactions")\
            .select("*")\
            .eq("user_id", str(user_id))\
            .neq("id", transaction_id)\
            .order("transaction_date", desc=True)\
            .limit(50)\
            .execute()
            
        transaction_history = history_response.data if history_response.data else []
        
        # 3. Fetch Vendor History
        # Ideally we have a vendors table, or we aggregate on the fly.
        # For prototype, let's try to fetch from vendors table if it exists and has data,
        # otherwise we might need to build it from transaction history.
        vendor_name = transaction.get("vendor_name")
        vendor_history = {}
        
        if vendor_name:
            # Check if we have a vendor record
            vendor_response = supabase.table("vendors").select("*").eq("name", vendor_name).execute()
            if vendor_response.data:
                v_data = vendor_response.data[0]
                vendor_history[vendor_name] = {
                    "avg_amount": v_data.get("avg_amount", 0),
                    "frequency": v_data.get("frequency", 0),
                    "trust_score": v_data.get("trust_score", 50)
                }
            else:
                # Basic on-the-fly aggregation from history
                vendor_txns = [t for t in transaction_history if t.get("vendor_name") == vendor_name]
                if vendor_txns:
                    avg = sum(t["debit"] for t in vendor_txns) / len(vendor_txns)
                    vendor_history[vendor_name] = {
                        "avg_amount": avg,
                        "frequency": len(vendor_txns),
                        "trust_score": 50 # Default
                    }
                else:
                    vendor_history[vendor_name] = {"avg_amount": 0, "frequency": 0, "trust_score": 50}
        
        # 4. Get Current Balance (Mock or Calculate)
        # In a real app, we'd query the latest balance.
        current_balance = 100000.0 # Placeholder
        
        # 5. Run Analysis
        # Map DB fields to AI engine expected fields
        # AI engine expects: id, vendor, amount, date, type, etc.
        mapped_txn = {
            "id": transaction["id"],
            "vendor": transaction.get("vendor_name", "Unknown"),
            "amount": transaction["debit"] if transaction["debit"] > 0 else transaction["credit"],
            "date": transaction["transaction_date"],
            "type": "debit" if transaction["debit"] > 0 else "credit",
            "description": transaction.get("description", ""),
            "utr": transaction.get("utr", "")
        }
        
        # Map history similarly
        mapped_history = []
        for t in transaction_history:
            mapped_history.append({
                "date": t["transaction_date"],
                "amount": t["debit"] if t["debit"] > 0 else t["credit"],
                "type": "debit" if t["debit"] > 0 else "credit",
                "vendor": t.get("vendor_name", "Unknown")
            })
            
        analysis_result = ai_service.analyze_transaction(
            transaction=mapped_txn,
            transaction_history=mapped_history,
            vendor_history=vendor_history,
            current_balance=current_balance
        )
        
        # 6. Update Transaction with Results
        # We need to store the analysis. 
        # The transactions table might need a jsonb column for 'ai_analysis' or separate columns.
        # Assuming we have an 'analysis_result' or similar column, or we update flags.
        
        updates = {
            "is_flagged": False,
            "flag_reason": None
        }
        
        # Check Fraud Guard results
        fraud_res = analysis_result.get("fraud_analysis", {})
        if fraud_res.get("risk_level") == "HIGH" or fraud_res.get("risk_level") == "CRITICAL":
            updates["is_flagged"] = True
            updates["flag_reason"] = f"Fraud Risk: {fraud_res.get('risk_level')}"
            
        # Check Compliance results
        comp_res = analysis_result.get("compliance_analysis", {})
        if comp_res.get("status") == "NON_COMPLIANT":
            updates["is_flagged"] = True
            reason = updates["flag_reason"] + "; " if updates["flag_reason"] else ""
            updates["flag_reason"] = f"{reason}Compliance Issue"

        # Save full analysis blob if column exists (let's assume 'metadata' or similar generic json col)
        # Or we create a new table 'transaction_analyses'. 
        # For prototype, let's try to update 'metadata' if it exists, or just the flags.
        # The schema showed 'additional_data' or similar? Let's check schema.
        # Schema had: category, tags, is_flagged, flag_reason.
        # We'll stick to flags for now and maybe store full JSON in a separate table if needed.
        # Actually, let's create an Alert if high risk.
        
        supabase.table("transactions").update(updates).eq("id", transaction_id).execute()
        
        # 7. Create Alert if needed
        if updates["is_flagged"]:
            alert_data = {
                "user_id": str(user_id),
                "type": "fraud_risk" if "Fraud" in updates["flag_reason"] else "compliance_issue",
                "severity": "high",
                "message": f"Transaction flagged: {updates['flag_reason']}",
                "is_read": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "metadata": analysis_result # Store full analysis here!
            }
            supabase.table("alerts").insert(alert_data).execute()
            
            # Send notification via n8n webhook
            from ..services.webhook_service import webhook_service
            await webhook_service.send_alert(alert_data)
            
        logger.info(f"Analysis complete for {transaction_id}")
        
    except Exception as e:
        logger.exception(f"Error analyzing transaction {transaction_id}")
