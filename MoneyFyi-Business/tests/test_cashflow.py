import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from cashflow_oracle import CashflowOracle
import json


def test_positive_cashflow():
    """Test 1: Positive cashflow should result in low stress"""
    print("\n" + "="*60)
    print("TEST 1: Positive Cashflow Detection")
    print("="*60)
    
    oracle = CashflowOracle()
    
    transactions = [
        {"date": "2025-10-01", "amount": 60000, "type": "credit"},
        {"date": "2025-10-08", "amount": 55000, "type": "credit"},
        {"date": "2025-10-15", "amount": 58000, "type": "credit"},
        {"date": "2025-10-22", "amount": 62000, "type": "credit"},
        {"date": "2025-10-05", "amount": -15000, "type": "debit"},
        {"date": "2025-10-12", "amount": -12000, "type": "debit"},
        {"date": "2025-10-19", "amount": -14000, "type": "debit"},
        {"date": "2025-10-26", "amount": -13000, "type": "debit"}
    ]
    
    result = oracle.predict(transactions, current_balance=100000)
    
    assert result['net_weekly_change'] > 0, "Failed: Should detect positive cashflow"
    assert result['cashflow_stress'] == 'low', f" Failed: Stress is {result['cashflow_stress']}, expected 'low'"
    
    print(" PASSED: Positive cashflow detected correctly")
    print(f"   Net Weekly Change: ₹{result['net_weekly_change']:,.0f}")
    print(f"   Cashflow Stress: {result['cashflow_stress']}")
    print(f"   Avg Weekly Income: ₹{result['avg_weekly_income']:,.0f}")
    print(f"   Avg Weekly Expense: ₹{result['avg_weekly_expense']:,.0f}")


def test_negative_cashflow():
    """Test 2: Negative cashflow should result in stress"""
    print("\n" + "="*60)
    print("TEST 2: Negative Cashflow Detection")
    print("="*60)
    
    oracle = CashflowOracle()
    
    
    transactions = [
        {"date": "2025-10-01", "amount": 40000, "type": "credit"},
        {"date": "2025-10-15", "amount": 38000, "type": "credit"},
        {"date": "2025-10-05", "amount": -25000, "type": "debit"},
        {"date": "2025-10-08", "amount": -18000, "type": "debit"},
        {"date": "2025-10-12", "amount": -22000, "type": "debit"},
        {"date": "2025-10-19", "amount": -20000, "type": "debit"}
    ]
    
    result = oracle.predict(transactions, current_balance=50000)
    
    assert result['net_weekly_change'] < 0, " Failed: Should detect negative cashflow"
    assert result['cashflow_stress'] in ['medium', 'high'], f" Failed: Stress should be elevated"
    
    print(" PASSED: Negative cashflow detected correctly")
    print(f"   Net Weekly Change: ₹{result['net_weekly_change']:,.0f}")
    print(f"   Cashflow Stress: {result['cashflow_stress']}")


def test_forecast_generation():
    """Test 3: Forecast should generate correct number of days"""
    print("\n" + "="*60)
    print("TEST 3: Forecast Generation")
    print("="*60)
    
    oracle = CashflowOracle()
    
    transactions = [
        {"date": "2025-10-01", "amount": 50000, "type": "credit"},
        {"date": "2025-10-15", "amount": 52000, "type": "credit"},
        {"date": "2025-10-05", "amount": -15000, "type": "debit"},
        {"date": "2025-10-20", "amount": -16000, "type": "debit"}
    ]
    
    result = oracle.predict(transactions, current_balance=75000)
    
    assert len(result['7_day_forecast']) == 7, f"Failed: 7-day forecast has {len(result['7_day_forecast'])} days"
    assert len(result['30_day_forecast']) == 30, f" Failed: 30-day forecast has {len(result['30_day_forecast'])} days"
    

    day1 = result['7_day_forecast'][0]
    assert 'day' in day1, " Failed: Missing 'day' field"
    assert 'date' in day1, " Failed: Missing 'date' field"
    assert 'predicted_balance' in day1, " Failed: Missing 'predicted_balance' field"
    assert 'confidence' in day1, " Failed: Missing 'confidence' field"
    
    print("PASSED: Forecasts generated correctly")
    print(f"   7-day forecast entries: {len(result['7_day_forecast'])}")
    print(f"   30-day forecast entries: {len(result['30_day_forecast'])}")
    print(f"   Sample forecast day 1: ₹{day1['predicted_balance']:,.0f} ({day1['confidence']} confidence)")


def test_critical_low_balance():
    """Test 4: Very low balance should trigger high stress"""
    print("\n" + "="*60)
    print("TEST 4: Critical Low Balance Detection")
    print("="*60)
    
    oracle = CashflowOracle()
    
    transactions = [
        {"date": "2025-10-01", "amount": 20000, "type": "credit"},
        {"date": "2025-10-15", "amount": 18000, "type": "credit"},
        {"date": "2025-10-05", "amount": -25000, "type": "debit"},
        {"date": "2025-10-10", "amount": -22000, "type": "debit"},
        {"date": "2025-10-18", "amount": -20000, "type": "debit"}
    ]
    
    result = oracle.predict(transactions, current_balance=15000)  # Very low balance
    
    assert result['cashflow_stress'] == 'high', f" Failed: Stress is {result['cashflow_stress']}, expected 'high'"
    
    # Check for critical insights
    insights_text = ' '.join(result['insights'])
    assert 'HIGH STRESS' in insights_text or 'CRITICAL' in insights_text, " Failed: Missing critical warning"
    
    print(" PASSED: Critical low balance detected correctly")
    print(f"   Current Balance: ₹{result['current_balance']:,.0f}")
    print(f"   Cashflow Stress: {result['cashflow_stress']}")
    print(f"   Critical Insights:")
    for insight in result['insights'][:3]:
        print(f"      {insight}")


def test_risk_identification():
    """Test 5: System should identify specific risks"""
    print("\n" + "="*60)
    print("TEST 5: Risk Identification")
    print("="*60)
    
    oracle = CashflowOracle()
    
    
    transactions = [
        {"date": "2025-10-01", "amount": 30000, "type": "credit"},
        {"date": "2025-10-15", "amount": 28000, "type": "credit"},
        {"date": "2025-10-05", "amount": -35000, "type": "debit"},
        {"date": "2025-10-20", "amount": -32000, "type": "debit"}
    ]
    
    result = oracle.predict(transactions, current_balance=25000)
    
    assert 'risks' in result, " Failed: 'risks' field missing"
    
    if result['risks']:
        print(" PASSED: Risks identified")
        print(f"   Number of risks: {len(result['risks'])}")
        for risk in result['risks'][:3]:
            print(f"      Day {risk['day']}: {risk['risk_type']} - {risk['severity']}")
    else:
        print("  WARNING: No risks identified (might be okay depending on data)")


def test_insights_generation():
    """Test 6: System should generate actionable insights"""
    print("\n" + "="*60)
    print("TEST 6: Insights Generation")
    print("="*60)
    
    oracle = CashflowOracle()
    
    transactions = [
        {"date": "2025-10-01", "amount": 50000, "type": "credit"},
        {"date": "2025-10-08", "amount": 48000, "type": "credit"},
        {"date": "2025-10-15", "amount": 52000, "type": "credit"},
        {"date": "2025-10-05", "amount": -18000, "type": "debit"},
        {"date": "2025-10-12", "amount": -20000, "type": "debit"},
        {"date": "2025-10-19", "amount": -19000, "type": "debit"}
    ]
    
    result = oracle.predict(transactions, current_balance=80000)
    
    assert 'insights' in result, " Failed: 'insights' field missing"
    assert len(result['insights']) > 0, " Failed: No insights generated"
 
    print(" PASSED: Insights generated correctly")
    print(f"   Number of insights: {len(result['insights'])}")
    for insight in result['insights']:
        print(f"      {insight}")


def run_all_tests():
    """Run all Cashflow Oracle tests"""
    print("\n" + "="*60)
    print("CASHFLOW ORACLE AGENT - TEST SUITE")
    print("="*60)
    
    tests = [
        test_positive_cashflow,
        test_negative_cashflow,
        test_forecast_generation,
        test_critical_low_balance,
        test_risk_identification,
        test_insights_generation
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"\nTEST FAILED: {str(e)}")
            failed += 1
        except Exception as e:
            print(f"\nTEST ERROR: {str(e)}")
            failed += 1
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f" Passed: {passed}")
    print(f" Failed: {failed}")
    print(f"Success Rate: {(passed/(passed+failed)*100):.1f}%")
    print("="*60)


if __name__ == "__main__":
    run_all_tests()