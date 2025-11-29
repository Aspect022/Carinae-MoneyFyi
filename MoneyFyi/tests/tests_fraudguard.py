import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fraudguard_agent import FraudGuardAgent
import json


def test_new_vendor_detection():
    """Test 1: New vendor should be flagged"""
    print("\n" + "="*60)
    print("TEST 1: New Vendor Detection")
    print("="*60)
    
    agent = FraudGuardAgent()
    
    transaction = {
        "id": "TEST_001",
        "vendor": "Brand New Supplier",
        "amount": 15000,
        "utr": "UTR_NEW_001",
        "date": "2025-11-16T10:00:00Z"
    }
    
    vendor_history = {
        "Existing Vendor": {"avg_amount": 10000, "frequency": 5}
    }
    
    result = agent.analyze_transaction(transaction, vendor_history)
    
    assert "NEW_VENDOR" in result['flags'], "Failed: New vendor not detected"
    assert result['fraud_score'] >= 25, " Failed: Score too low for new vendor"
    
    print("PASSED: New vendor detected correctly")
    print(f"   Fraud Score: {result['fraud_score']}")
    print(f"   Flags: {result['flags']}")


def test_amount_anomaly():
    """Test 2: Unusual amount spike should be detected"""
    print("\n" + "="*60)
    print("TEST 2: Amount Anomaly Detection")
    print("="*60)
    
    agent = FraudGuardAgent()
    
    transaction = {
        "id": "TEST_002",
        "vendor": "Regular Vendor",
        "amount": 60000,  
        "utr": "UTR_ANOM_001",
        "date": "2025-11-16T11:00:00Z"
    }
    
    vendor_history = {
        "Regular Vendor": {"avg_amount": 15000, "frequency": 10}
    }
    
    result = agent.analyze_transaction(transaction, vendor_history)
    
    assert "UNUSUAL_AMOUNT" in result['flags'], "Failed: Amount anomaly not detected"
    assert result['fraud_score'] >= 30, "Failed: Score too low for amount spike"
    
    print("PASSED: Amount anomaly detected correctly")
    print(f"   Fraud Score: {result['fraud_score']}")
    print(f"   Flags: {result['flags']}")


def test_duplicate_utr():
    """Test 3: Duplicate UTR should be caught"""
    print("\n" + "="*60)
    print("TEST 3: Duplicate UTR Detection")
    print("="*60)
    
    agent = FraudGuardAgent()
    
    transaction1 = {
        "id": "TEST_003A",
        "vendor": "Vendor A",
        "amount": 10000,
        "utr": "UTR_DUPLICATE_123",
        "date": "2025-11-16T12:00:00Z"
    }
    
    transaction2 = {
        "id": "TEST_003B",
        "vendor": "Vendor B",
        "amount": 15000,
        "utr": "UTR_DUPLICATE_123",  
        "date": "2025-11-16T12:30:00Z"
    }
    
    vendor_history = {
        "Vendor A": {"avg_amount": 10000, "frequency": 5},
        "Vendor B": {"avg_amount": 15000, "frequency": 3}
    }
    
    result1 = agent.analyze_transaction(transaction1, vendor_history)
    assert "DUPLICATE_UTR" not in result1['flags'], " Failed: False positive on first UTR"
    
    
    result2 = agent.analyze_transaction(transaction2, vendor_history)
    assert "DUPLICATE_UTR" in result2['flags'], "Failed: Duplicate UTR not detected"
    assert result2['fraud_score'] >= 40, " Failed: Score too low for duplicate"
    
    print(" PASSED: Duplicate UTR detected correctly")
    print(f"   Transaction 1 Score: {result1['fraud_score']}")
    print(f"   Transaction 2 Score: {result2['fraud_score']}")
    print(f"   Transaction 2 Flags: {result2['flags']}")


def test_high_risk_scenario():
    """Test 4: Multiple red flags should result in high risk"""
    print("\n" + "="*60)
    print("TEST 4: High Risk Scenario (Multiple Flags)")
    print("="*60)
    
    agent = FraudGuardAgent()
    
    transaction = {
        "id": "TEST_004",
        "vendor": "Suspicious New Corp",
        "amount": 100000,  
        "utr": "UTR_HIGHRISK_001",
        "date": "2025-11-16T23:30:00Z"  
    }
    
    vendor_history = {}  
    
    result = agent.analyze_transaction(transaction, vendor_history)
    
    assert result['risk_level'] == 'high', f"Failed: Risk level is {result['risk_level']}, expected 'high'"
    assert result['fraud_score'] >= 70, f" Failed: Score {result['fraud_score']} too low for high risk"
    assert len(result['flags']) >= 3, f"Failed: Only {len(result['flags'])} flags detected"
    
    print("PASSED: High risk scenario detected correctly")
    print(f"   Fraud Score: {result['fraud_score']}")
    print(f"   Risk Level: {result['risk_level']}")
    print(f"   Flags: {result['flags']}")
    print(f"   Reasoning: {result['reasoning']}")


def test_low_risk_normal_transaction():
    """Test 5: Normal transaction should pass"""
    print("\n" + "="*60)
    print("TEST 5: Low Risk Normal Transaction")
    print("="*60)
    
    agent = FraudGuardAgent()
    
    transaction = {
        "id": "TEST_005",
        "vendor": "Trusted Vendor",
        "amount": 12000,  
        "utr": "UTR_NORMAL_001",
        "date": "2025-11-15T14:00:00Z"  
    }
    
    vendor_history = {
        "Trusted Vendor": {"avg_amount": 11500, "frequency": 15}
    }
    
    result = agent.analyze_transaction(transaction, vendor_history)
    
    assert result['risk_level'] == 'low', f"Failed: Risk level is {result['risk_level']}, expected 'low'"
    assert result['fraud_score'] < 40, f"Failed: Score {result['fraud_score']} too high for low risk"
    
    print("PASSED: Normal transaction passed correctly")
    print(f"   Fraud Score: {result['fraud_score']}")
    print(f"   Risk Level: {result['risk_level']}")
    print(f"   Recommendation: {result['recommendation']}")


def test_batch_analysis():
    """Test 6: Batch analysis of multiple transactions"""
    print("\n" + "="*60)
    print("TEST 6: Batch Analysis")
    print("="*60)
    
    agent = FraudGuardAgent()
    
    transactions = [
        {"id": "BATCH_001", "vendor": "Vendor A", "amount": 10000, "utr": "UTR_B1", "date": "2025-11-16T10:00:00Z"},
        {"id": "BATCH_002", "vendor": "Vendor B", "amount": 15000, "utr": "UTR_B2", "date": "2025-11-16T11:00:00Z"},
        {"id": "BATCH_003", "vendor": "Suspicious", "amount": 80000, "utr": "UTR_B3", "date": "2025-11-16T23:00:00Z"}
    ]
    
    vendor_history = {
        "Vendor A": {"avg_amount": 10000, "frequency": 10},
        "Vendor B": {"avg_amount": 14000, "frequency": 8}
    }
    
    results = agent.analyze_batch(transactions, vendor_history)
    
    assert len(results) == 3, " Failed: Not all transactions analyzed"
    
    
    assert results[2]['risk_level'] in ['high', 'medium'], " Failed: Suspicious transaction not flagged"
    
    
    summary = agent.get_summary_stats(results)
    
    print("PASSED: Batch analysis completed")
    print(f"   Total Analyzed: {summary['total_analyzed']}")
    print(f"   High Risk: {summary['high_risk_count']}")
    print(f"   Medium Risk: {summary['medium_risk_count']}")
    print(f"   Low Risk: {summary['low_risk_count']}")
    print(f"   Average Score: {summary['average_fraud_score']}")


def run_all_tests():
    """Run all FraudGuard tests"""
    print("\n" + "="*60)
    print("FRAUDGUARD AGENT - TEST SUITE")
    print("="*60)
    
    tests = [
        test_new_vendor_detection,
        test_amount_anomaly,
        test_duplicate_utr,
        test_high_risk_scenario,
        test_low_risk_normal_transaction,
        test_batch_analysis
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
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/(passed+failed)*100):.1f}%")
    print("="*60)


if __name__ == "__main__":
    run_all_tests()