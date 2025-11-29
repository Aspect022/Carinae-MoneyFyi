"""
ComplianceMateAgent - GST, TDS, MSME, and regulatory compliance checking
Part of MoneyFyi AI Intelligence Layer
"""

import re
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional


class ComplianceMateAgent:
    """
    Checks compliance for:
    - GST validation and mismatches
    - TDS requirements (194C, 194J, etc.)
    - MSME 45-day payment rule
    - PF/ESI payroll compliance
    - ITC eligibility
    """
    
    def __init__(self):
        self.gstin_pattern = re.compile(r'\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}')
        
        self.tds_thresholds = {
            "194C": {"threshold": 30000, "rate": 1, "description": "Contractors"},
            "194J": {"threshold": 30000, "rate": 10, "description": "Professional/Technical Services"},
            "194I": {"threshold": 240000, "rate": 10, "description": "Rent"},
            "194H": {"threshold": 15000, "rate": 5, "description": "Commission"},
            "194Q": {"threshold": 5000000, "rate": 0.1, "description": "Purchase of Goods"},
        }
        
        self.gst_rates = {
            "supplies": 18,
            "services": 18,
            "equipment": 18,
            "construction": 18,
            "food": 5,
            "medicines": 12,
        }
    
    def check_compliance(
        self,
        transaction: Dict[str, Any],
        vendor_history: Dict[str, Any],
        all_transactions: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Main compliance check function
        
        Args:
            transaction: Normalized transaction
            vendor_history: Historical vendor data
            all_transactions: All transactions for aggregate checks
            
        Returns:
            Compliance analysis with flags, warnings, and severity
        """
        flags = []
        warnings = []
        details = []
        
        vendor = transaction.get('vendor', 'Unknown')
        amount = transaction.get('amount', 0)
        txn_date = transaction.get('date', '')
        gst_info = transaction.get('gst', {})
        category = transaction.get('category', '')
        
        vendor_data = vendor_history.get(vendor, {})
        
        gst_check = self._check_gst_compliance(transaction, gst_info, category)
        if gst_check['flags']:
            flags.extend(gst_check['flags'])
            warnings.extend(gst_check['warnings'])
            details.extend(gst_check['details'])
        
        tds_check = self._check_tds_compliance(transaction, vendor_data, category)
        if tds_check['flags']:
            flags.extend(tds_check['flags'])
            warnings.extend(tds_check['warnings'])
            details.extend(tds_check['details'])
        
        msme_check = self._check_msme_compliance(transaction, vendor_data, txn_date)
        if msme_check['flags']:
            flags.extend(msme_check['flags'])
            warnings.extend(msme_check['warnings'])
            details.extend(msme_check['details'])
        
        itc_check = self._check_itc_eligibility(transaction, gst_info)
        if itc_check['warnings']:
            warnings.extend(itc_check['warnings'])
            details.extend(itc_check['details'])
        
        if 'salary' in category.lower() if category else False:
            payroll_check = self._check_payroll_compliance(transaction, amount)
            if payroll_check['flags']:
                flags.extend(payroll_check['flags'])
                warnings.extend(payroll_check['warnings'])
                details.extend(payroll_check['details'])
        
        severity = self._calculate_severity(flags, warnings)
        
        return {
            "transaction_id": transaction.get('id', 'unknown'),
            "vendor": vendor,
            "amount": amount,
            "compliance_flags": flags,
            "warnings": warnings,
            "details": details,
            "severity": severity,
            "timestamp": datetime.now().isoformat()
        }
    
    def _check_gst_compliance(
        self,
        transaction: Dict,
        gst_info: Optional[Dict],
        category: Optional[str]
    ) -> Dict[str, Any]:
        """Check GST-related compliance"""
        flags = []
        warnings = []
        details = []
        
        amount = transaction.get('amount', 0)
        
        if amount > 200:
            if not gst_info:
                flags.append("MISSING_GST")
                warnings.append(f" GST missing for transaction of ₹{amount:,.0f}")
                details.append("GST should be collected for B2B transactions above ₹200")
            else:
                gstin = gst_info.get('gstin')
                if gstin:
                    if not self.gstin_pattern.match(gstin):
                        flags.append("INVALID_GSTIN")
                        warnings.append(f"Invalid GSTIN format: {gstin}")
                        details.append("GSTIN must be in format: 22AAAAA0000A1Z5")
                    else:
                        if self._is_fake_gstin(gstin):
                            flags.append("FAKE_GSTIN")
                            warnings.append(f" Suspected fake GSTIN: {gstin}")
                            details.append("GSTIN appears to be dummy/test number")
                
                gst_rate = gst_info.get('rate')
                if gst_rate:
                    expected_rate = self._get_expected_gst_rate(category)
                    if expected_rate and abs(gst_rate - expected_rate) > 0:
                        flags.append("GST_MISMATCH")
                        warnings.append(f" GST rate {gst_rate}% doesn't match expected {expected_rate}% for {category}")
                        details.append(f"Standard GST for {category} is {expected_rate}%")
                
                gst_amount = gst_info.get('amount')
                if gst_rate and gst_amount:
                    base_amount = amount / (1 + gst_rate / 100)
                    expected_gst = base_amount * (gst_rate / 100)
                    
                    if abs(gst_amount - expected_gst) > 10:  # ₹10 tolerance
                        flags.append("GST_CALCULATION_ERROR")
                        warnings.append(f" GST amount mismatch: ₹{gst_amount:,.2f} vs expected ₹{expected_gst:,.2f}")
                        details.append("GST calculation appears incorrect")
        
        return {"flags": flags, "warnings": warnings, "details": details}
    
    def _check_tds_compliance(
        self,
        transaction: Dict,
        vendor_data: Dict,
        category: Optional[str]
    ) -> Dict[str, Any]:
        """Check TDS requirements"""
        flags = []
        warnings = []
        details = []
        
        amount = transaction.get('amount', 0)
        txn_type = transaction.get('type', 'debit')
        
        if txn_type != 'debit':
            return {"flags": flags, "warnings": warnings, "details": details}
        
        tds_section = self._determine_tds_section(category, vendor_data)
        
        if tds_section and tds_section in self.tds_thresholds:
            threshold_info = self.tds_thresholds[tds_section]
            threshold = threshold_info['threshold']
            rate = threshold_info['rate']
            description = threshold_info['description']
            
            if amount >= threshold:
                expected_tds = amount * (rate / 100)
                
                flags.append(f"TDS_REQUIRED_{tds_section}")
                warnings.append(f" TDS deduction required under section {tds_section}")
                details.append(f"Amount ₹{amount:,.0f} exceeds threshold ₹{threshold:,.0f}")
                details.append(f"Expected TDS @ {rate}%: ₹{expected_tds:,.2f}")
                details.append(f"Category: {description}")
        
        return {"flags": flags, "warnings": warnings, "details": details}
    
    def _check_msme_compliance(
        self,
        transaction: Dict,
        vendor_data: Dict,
        txn_date: str
    ) -> Dict[str, Any]:
        """Check MSME 45-day payment rule"""
        flags = []
        warnings = []
        details = []
        
        is_msme = vendor_data.get('is_msme', False)
        msme_number = vendor_data.get('msme_number')
        
        if is_msme or msme_number:
            try:
                txn_dt = datetime.fromisoformat(txn_date.replace('Z', '+00:00'))
                days_passed = (datetime.now() - txn_dt).days
                
                if days_passed > 45:
                    flags.append("MSME_45DAY_VIOLATION")
                    warnings.append(f" MSME payment overdue by {days_passed - 45} days")
                    details.append("MSME Act requires payment within 45 days")
                    details.append(f"Interest @ 3x bank rate applicable after 45 days")
                elif days_passed > 30:
                    warnings.append(f" MSME payment approaching deadline ({days_passed} days)")
                    details.append("15 days remaining to avoid penalty interest")
            except:
                pass
        
        return {"flags": flags, "warnings": warnings, "details": details}
    
    def _check_itc_eligibility(
        self,
        transaction: Dict,
        gst_info: Optional[Dict]
    ) -> Dict[str, Any]:
        """Check Input Tax Credit eligibility"""
        warnings = []
        details = []
        
        if not gst_info:
            return {"warnings": warnings, "details": details}
        
        category = transaction.get('category', '').lower()
        
        blocked_categories = ['food', 'entertainment', 'personal', 'club', 'health']
        
        if any(blocked in category for blocked in blocked_categories):
            warnings.append(f"ITC may not be available for {category}")
            details.append(f"ITC blocked under Section 17(5) for {category}")
        
        has_gstin = bool(gst_info.get('gstin'))
        if not has_gstin:
            warnings.append(" GSTIN required for ITC claim")
            details.append("Ensure valid tax invoice with supplier GSTIN")
        
        return {"warnings": warnings, "details": details}
    
    def _check_payroll_compliance(
        self,
        transaction: Dict,
        amount: float
    ) -> Dict[str, Any]:
        """Check PF/ESI compliance for salary payments"""
        flags = []
        warnings = []
        details = []
        
        pf_threshold = 15000
        esi_threshold = 21000
        
        if amount >= pf_threshold:
            warnings.append("PF deduction required (12% employer + 12% employee)")
            details.append(f"Salary ₹{amount:,.0f} exceeds PF threshold ₹{pf_threshold:,.0f}")
        
        if amount <= esi_threshold:
            warnings.append(" ESI applicable (3.25% employer + 0.75% employee)")
            details.append(f"Salary ₹{amount:,.0f} falls under ESI limit ₹{esi_threshold:,.0f}")
        
        return {"flags": flags, "warnings": warnings, "details": details}
    
    def _determine_tds_section(self, category: Optional[str], vendor_data: Dict) -> Optional[str]:
        """Determine applicable TDS section"""
        if not category:
            return None
        
        category_lower = category.lower()
        
        if 'contract' in category_lower or 'construction' in category_lower:
            return "194C"
        elif 'professional' in category_lower or 'consultant' in category_lower or 'service' in category_lower:
            return "194J"
        elif 'rent' in category_lower or 'lease' in category_lower:
            return "194I"
        elif 'commission' in category_lower or 'brokerage' in category_lower:
            return "194H"
        elif 'goods' in category_lower or 'purchase' in category_lower:
            annual_purchases = vendor_data.get('annual_purchase_value', 0)
            if annual_purchases >= 5000000:
                return "194Q"
        
        return None
    
    def _get_expected_gst_rate(self, category: Optional[str]) -> Optional[int]:
        """Get expected GST rate for category"""
        if not category:
            return 18  
        
        category_lower = category.lower()
        
        for cat, rate in self.gst_rates.items():
            if cat in category_lower:
                return rate
        
        return 18  
    
    def _is_fake_gstin(self, gstin: str) -> bool:
        """Detect fake/dummy GSTIN patterns"""
        fake_patterns = [
            r'00AAAAA0000A',  
            r'99[A-Z]{5}9999',  
            r'(\d)\1{10}',  
            r'12345', 
            r'ABCDE',  
        ]
        
        for pattern in fake_patterns:
            if re.search(pattern, gstin):
                return True
        
        return False
    
    def _calculate_severity(self, flags: List[str], warnings: List[str]) -> str:
        """Calculate overall compliance severity"""
        critical = ['FAKE_GSTIN', 'TDS_REQUIRED', 'MSME_45DAY_VIOLATION']
        
        if any(flag in ' '.join(flags) for flag in critical):
            return "high"
        
        if len(flags) >= 2:
            return "medium"
        
        if len(warnings) > 0:
            return "low"
        
        return "none"


if __name__ == "__main__":
    agent = ComplianceMateAgent()
    
    transaction = {
        "id": "TXN_001",
        "vendor": "ABC Contractors",
        "amount": 50000,
        "date": "2025-09-01T10:00:00Z",
        "type": "debit",
        "category": "construction",
        "gst": {
            "rate": 18,
            "amount": 9000,
            "gstin": "27AABCU9603R1ZM"
        }
    }
    
    vendor_history = {
        "ABC Contractors": {
            "is_msme": True,
            "msme_number": "UDYAM-DL-00-1234567"
        }
    }
    
    result = agent.check_compliance(transaction, vendor_history)
    
    print("=" * 60)
    print("COMPLIANCE MATE ANALYSIS")
    print("=" * 60)
    print(f"\nVendor: {result['vendor']}")
    print(f"Amount: ₹{result['amount']:,.0f}")
    print(f"Severity: {result['severity'].upper()}")
    
    if result['compliance_flags']:
        print(f"\nCompliance Flags:")
        for flag in result['compliance_flags']:
            print(f"  - {flag}")
    
    if result['warnings']:
        print(f"\n Warnings:")
        for warning in result['warnings']:
            print(f"  {warning}")
    
    if result['details']:
        print(f"\nℹDetails:")
        for detail in result['details']:
            print(f"  • {detail}")