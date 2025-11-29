
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from smartpayment_agent import SmartPaymentAgent
import json


def test_approve_safe_payment():
    """Test 1: Safe payment should be approved"""
    print("\n" + "="*60)
    print("TEST 1: Approve Safe Payment")
    print("="*60)
    
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TEST_001",
        "vendor": "Trusted Vendor",
        "amount": 15000,
        "due_date": "2025-11-20"
    }
    
    fraud_analysis = {
        "fraud_score": 10,
        "risk_level": "low",
        "flags": [],
        "reasoning": []
    }
    
    cashflow_analysis = {
        "current_balance": 100000,
        "cashflow_stress": "low",
        "net_weekly_change": 10000,
        "7_day_forecast": [
            {"day": 1, "predicted_balance": 98000},
            {"day": 7, "predicted_balance": 85000}
        ]
    }
    
    vendor_history = {
        "Trusted Vendor": {
            "trust_score": 90,
            "frequency": 15,
            "avg_amount": 14000
        }
    }
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
    assert result['recommendation'] == 'PAY_FULL', f" Failed: Got {result['recommendation']}, expected PAY_FULL"
    assert result['payment_safety_score'] >= 70, f" Failed: Safety score {result['payment_safety_score']} too low"
    assert result['suggested_pct'] == 100, f" Failed: Should suggest 100%, got {result['suggested_pct']}%"
    
    print(" PASSED: Safe payment approved correctly")
    print(f"   Recommendation: {result['recommendation']}")
    print(f"   Safety Score: {result['payment_safety_score']}/100")
    print(f"   Suggested: Pay ₹{result['suggested_amount']:,.0f} ({result['suggested_pct']}%)")


def test_block_high_fraud():
    """Test 2: High fraud risk should block payment"""
    print("\n" + "="*60)
    print("TEST 2: Block High Fraud Risk Payment")
    print("="*60)
    
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TEST_002",
        "vendor": "Suspicious Vendor",
        "amount": 50000,
        "due_date": "2025-11-20"
    }
    
    
    fraud_analysis = {
        "fraud_score": 85,
        "risk_level": "high",
        "flags": ["NEW_VENDOR", "UNUSUAL_AMOUNT", "DUPLICATE_UTR"],
        "reasoning": ["First transaction", "Amount 5x higher", "Duplicate payment"]
    }
    
    cashflow_analysis = {
        "current_balance": 80000,
        "cashflow_stress": "low",
        "net_weekly_change": 5000,
        "7_day_forecast": [{"day": 1, "predicted_balance": 75000}]
    }
    
    vendor_history = {}
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
    assert result['recommendation'] == 'AVOID', f" Failed: Got {result['recommendation']}, expected AVOID"
    assert result['suggested_pct'] == 0, f" Failed: Should suggest 0%, got {result['suggested_pct']}%"
    
    print(" PASSED: High fraud payment blocked correctly")
    print(f"   Recommendation: {result['recommendation']}")
    print(f"   Safety Score: {result['payment_safety_score']}/100")
    print(f"   Risk Factors: {len(result['risk_factors'])}")


def test_partial_payment_recommendation():
    """Test 3: Moderate risk should suggest partial payment"""
    print("\n" + "="*60)
    print("TEST 3: Partial Payment Recommendation")
    print("="*60)
    
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TEST_003",
        "vendor": "Medium Trust Vendor",
        "amount": 40000,
        "due_date": "2025-11-20"
    }
    
    
    fraud_analysis = {
        "fraud_score": 35,
        "risk_level": "medium",
        "flags": ["ELEVATED_AMOUNT"],
        "reasoning": ["Amount 2x higher than usual"]
    }
    
    cashflow_analysis = {
        "current_balance": 60000,
        "cashflow_stress": "medium",
        "net_weekly_change": -2000,
        "7_day_forecast": [
            {"day": 1, "predicted_balance": 55000},
            {"day": 7, "predicted_balance": 45000}
        ]
    }
    
    vendor_history = {
        "Medium Trust Vendor": {
            "trust_score": 65,
            "frequency": 5,
            "avg_amount": 20000
        }
    }
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
    assert result['recommendation'] == 'PAY_PARTIALLY', f" Failed: Got {result['recommendation']}, expected PAY_PARTIALLY"
    assert 0 < result['suggested_pct'] < 100, f" Failed: Partial payment should be between 0-100%"
    
    print(" PASSED: Partial payment recommended correctly")
    print(f"   Recommendation: {result['recommendation']}")
    print(f"   Safety Score: {result['payment_safety_score']}/100")
    print(f"   Suggested: Pay ₹{result['suggested_amount']:,.0f} ({result['suggested_pct']}%)")


def test_cashflow_stress_blocking():
    """Test 4: High cashflow stress should block large payment"""
    print("\n" + "="*60)
    print("TEST 4: Cashflow Stress Blocking")
    print("="*60)
    
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TEST_004",
        "vendor": "Regular Vendor",
        "amount": 80000,  
        "due_date": "2025-11-20"
    }
    
   
    fraud_analysis = {
        "fraud_score": 15,
        "risk_level": "low",
        "flags": [],
        "reasoning": []
    }
    
    cashflow_analysis = {
        "current_balance": 90000,
        "cashflow_stress": "high",  
        "net_weekly_change": -15000,
        "7_day_forecast": [
            {"day": 1, "predicted_balance": 75000},
            {"day": 7, "predicted_balance": 10000}  
        ]
    }
    
    vendor_history = {
        "Regular Vendor": {
            "trust_score": 85,
            "frequency": 10,
            "avg_amount": 25000
        }
    }
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
   
    assert result['recommendation'] in ['AVOID', 'PAY_PARTIALLY'], \
        f" Failed: Should avoid/partial due to cashflow, got {result['recommendation']}"
    
    print(" PASSED: Cashflow stress handled correctly")
    print(f"   Recommendation: {result['recommendation']}")
    print(f"   Safety Score: {result['payment_safety_score']}/100")
    print(f"   Suggested: Pay ₹{result['suggested_amount']:,.0f} ({result['suggested_pct']}%)")


def test_duplicate_utr_override():
    """Test 5: Duplicate UTR should always block payment"""
    print("\n" + "="*60)
    print("TEST 5: Duplicate UTR Override")
    print("="*60)
    
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TEST_005",
        "vendor": "Trusted Vendor",  
        "amount": 10000,
        "due_date": "2025-11-20"
    }
    
  
    fraud_analysis = {
        "fraud_score": 55,
        "risk_level": "medium",
        "flags": ["DUPLICATE_UTR"],  
        "reasoning": ["UTR already used"]
    }
    
    cashflow_analysis = {
        "current_balance": 100000,
        "cashflow_stress": "low",
        "net_weekly_change": 10000,
        "7_day_forecast": [{"day": 1, "predicted_balance": 95000}]
    }
    
    vendor_history = {
        "Trusted Vendor": {
            "trust_score": 95,
            "frequency": 20,
            "avg_amount": 10000
        }
    }
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
    
    assert result['payment_safety_score'] < 50, \
        f"Failed: Duplicate UTR should drastically lower score, got {result['payment_safety_score']}"
    
    print(" PASSED: Duplicate UTR handled with high severity")
    print(f"   Recommendation: {result['recommendation']}")
    print(f"   Safety Score: {result['payment_safety_score']}/100")
    print(f"   Risk Factors:")
    for factor in result['risk_factors'][:3]:
        print(f"      {factor}")


def test_alternative_actions_generation():
    """Test 6: System should generate alternative actions"""
    print("\n" + "="*60)
    print("TEST 6: Alternative Actions Generation")
    print("="*60)
    
    agent = SmartPaymentAgent()
    
    transaction = {
        "id": "TEST_006",
        "vendor": "Vendor X",
        "amount": 35000,
        "due_date": "2025-11-20"
    }
    
    fraud_analysis = {
        "fraud_score": 50,
        "risk_level": "medium",
        "flags": ["NEW_VENDOR"],
        "reasoning": []
    }
    
    cashflow_analysis = {
        "current_balance": 50000,
        "cashflow_stress": "medium",
        "net_weekly_change": 0,
        "7_day_forecast": [{"day": 1, "predicted_balance": 45000}]
    }
    
    vendor_history = {}
    
    result = agent.recommend(transaction, fraud_analysis, cashflow_analysis, vendor_history)
    
    assert 'alternative_actions' in result, " Failed: Missing alternative_actions field"
    assert len(result['alternative_actions']) > 0, "Failed: No alternative actions generated"
    
    print(" PASSED: Alternative actions generated")
    print(f"   Recommendation: {result['recommendation']}")
    print(f"   Alternative Actions:")
    for action in result['alternative_actions']:
        print(f"      {action}")


def test_batch_summary():
    """Test 7: Batch summary statistics"""
    print("\n" + "="*60)
    print("TEST 7: Batch Summary Statistics")
    print("="*60)
    
    agent = SmartPaymentAgent()

    test_cases = [
        ({"vendor": "V1", "amount": 10000}, 15, "low", 90000, "low"),
        ({"vendor": "V2", "amount": 50000}, 75, "high", 90000, "low"),
        ({"vendor": "V3", "amount": 30000}, 40, "medium", 50000, "medium")
    ]
    
    for txn, fraud_score, fraud_risk, balance, cf_stress in test_cases:
        agent.recommend(
            txn,
            {"fraud_score": fraud_score, "risk_level": fraud_risk, "flags": [], "reasoning": []},
            {"current_balance": balance, "cashflow_stress": cf_stress, "net_weekly_change": 0, "7_day_forecast": []},
            {}
        )
    
    summary = agent.get_summary()
    
    assert summary['total_decisions'] == 3, f" Failed: Expected 3 decisions, got {summary['total_decisions']}"
    assert 'pay_full_count' in summary, " Failed: Missing pay_full_count"
    assert 'avoid_count' in summary, " Failed: Missing avoid_count"
    
    print(" PASSED: Batch summary generated correctly")
    print(f"   Total Decisions: {summary['total_decisions']}")
    print(f"   Pay Full: {summary['pay_full_count']}")
    print(f"   Pay Partially: {summary['pay_partially_count']}")
    print(f"   Avoid: {summary['avoid_count']}")
    print(f"   Average Safety Score: {summary['average_safety_score']}")


def run_all_tests():
    """Run all SmartPayment tests"""
    print("\n" + "="*60)
    print("SMARTPAYMENT AGENT - TEST SUITE")
    print("="*60)
    
    tests = [
        test_approve_safe_payment,
        test_block_high_fraud,
        test_partial_payment_recommendation,
        test_cashflow_stress_blocking,
        test_duplicate_utr_override,
        test_alternative_actions_generation,
        test_batch_summary
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"\n TEST FAILED: {str(e)}")
            failed += 1
        except Exception as e:
            print(f"\n TEST ERROR: {str(e)}")
            failed += 1
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f" Passed: {passed}")
    print(f" Failed: {failed}")
    print(f" Success Rate: {(passed/(passed+failed)*100):.1f}%")
    print("="*60)


if __name__ == "__main__":
    run_all_tests()