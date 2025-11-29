from typing import Any, List, Dict
from uuid import UUID
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from ..database import get_supabase
from ..dependencies import get_current_user_id
from ..services.gemini_service import gemini_service
from ..services.ai_service import ai_service

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/executive-summary")
async def get_executive_summary(
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Dict[str, Any]:
    """
    Generate an AI-powered executive summary of the user's financial status.
    Uses Gemini LLM to analyze recent transactions and alerts.
    """
    # 1. Fetch recent context (last 30 days)
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
    
    txns = supabase.table("transactions")\
        .select("*")\
        .eq("user_id", str(user_id))\
        .gte("transaction_date", thirty_days_ago)\
        .order("transaction_date", desc=True)\
        .execute()
        
    alerts = supabase.table("alerts")\
        .select("*")\
        .eq("user_id", str(user_id))\
        .eq("is_resolved", False)\
        .execute()
        
    if not txns.data:
        return {"summary": "No recent transaction data available to generate a summary."}
        
    # 2. Prepare context for Gemini
    context = {
        "transaction_count": len(txns.data),
        "total_debit": sum(t["debit"] for t in txns.data),
        "total_credit": sum(t["credit"] for t in txns.data),
        "active_alerts": len(alerts.data),
        "recent_transactions": txns.data[:10], # Send top 10 for detail
        "alerts": alerts.data[:5]
    }
    
    # 3. Generate Summary
    prompt = """
    You are a CFO-level AI advisor. 
    Analyze the provided financial context and generate a concise executive summary.
    
    Structure your response in Markdown:
    1. **Financial Health**: Brief assessment of cash flow and activity.
    2. **Key Risks**: Highlight any active alerts or suspicious patterns.
    3. **Action Items**: 2-3 bullet points on what the user should do next.
    
    Keep it professional, direct, and helpful.
    """
    
    summary = await gemini_service.generate_insights(context, prompt)
    
    return {"summary": summary, "generated_at": datetime.now().isoformat()}

@router.get("/cashflow")
async def get_cashflow_forecast(
    days: int = 30,
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Dict[str, Any]:
    """
    Get cashflow forecast using the CashflowOracle agent.
    """
    # Fetch history for prediction
    history = supabase.table("transactions")\
        .select("*")\
        .eq("user_id", str(user_id))\
        .order("transaction_date", desc=True)\
        .limit(100)\
        .execute()
        
    if not history.data:
        return {"forecast": [], "status": "insufficient_data"}
        
    # Map to AI engine format
    mapped_history = []
    for t in history.data:
        mapped_history.append({
            "date": t["transaction_date"],
            "amount": t["debit"] if t["debit"] > 0 else t["credit"],
            "type": "debit" if t["debit"] > 0 else "credit",
            "vendor": t.get("vendor_name", "Unknown")
        })
        
    # We need to access the CashflowOracle directly or via a specific method in ai_service
    # Since ai_service exposes the engine, let's use that.
    # The engine has 'cashflow_oracle' attribute.
    
    current_balance = 100000.0 # Placeholder, should fetch real balance
    
    forecast = ai_service.engine.cashflow_oracle.predict(
        mapped_history,
        current_balance
    )
    
    return forecast

@router.get("/compliance")
async def get_compliance_report(
    user_id: UUID = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
) -> Dict[str, Any]:
    """
    Get compliance status report.
    Aggregates flagged transactions and compliance issues.
    """
    # Fetch transactions flagged for compliance
    issues = supabase.table("transactions")\
        .select("*")\
        .eq("user_id", str(user_id))\
        .eq("is_flagged", True)\
        .ilike("flag_reason", "%Compliance%")\
        .execute()
        
    return {
        "status": "AT_RISK" if issues.data else "COMPLIANT",
        "issue_count": len(issues.data),
        "issues": issues.data,
        "checked_at": datetime.now().isoformat()
    }
