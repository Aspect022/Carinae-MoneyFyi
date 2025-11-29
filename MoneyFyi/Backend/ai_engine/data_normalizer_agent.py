

import re
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid


class DataNormalizerAgent:
    """
    Normalizes ANY raw financial data into standardized transaction format.
    Handles multiple input sources and ensures pipeline never breaks.
    """
    
    def __init__(self):
        self.supported_modes = ["UPI", "NEFT", "IMPS", "RTGS", "CASH", "BANK_TRANSFER", "CARD", "CHEQUE"]
        self.utr_pattern = re.compile(r'UTR[A-Za-z0-9]{6,}|[A-Z0-9]{12,}')
        self.gstin_pattern = re.compile(r'\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}')
        self.amount_pattern = re.compile(r'(?:Rs\.?|₹|INR)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)')
        
    def normalize(self, raw_data: Any, source_type: str = "auto") -> Dict[str, Any]:
        """
        Main normalization function - converts any raw data to standard format
        
        Args:
            raw_data: Raw input (string, dict, list, etc.)
            source_type: "ocr", "pdf", "csv", "json", "email", "auto"
            
        Returns:
            Normalized transaction dict that fits existing pipeline
        """
        try:
            
            if source_type == "auto":
                source_type = self._detect_source_type(raw_data)
            
            if source_type == "json" and isinstance(raw_data, dict):
                return self._normalize_json(raw_data)
            elif source_type == "csv" and isinstance(raw_data, (list, str)):
                return self._normalize_csv(raw_data)
            elif source_type in ["ocr", "pdf", "email"] and isinstance(raw_data, str):
                return self._normalize_text(raw_data)
            elif isinstance(raw_data, dict):
                return self._normalize_json(raw_data)
            elif isinstance(raw_data, str):
                return self._normalize_text(raw_data)
            else:
                return self._create_safe_default()
                
        except Exception as e:
            print(f" Normalization error: {str(e)}, using safe defaults")
            return self._create_safe_default()
    
    def normalize_batch(self, raw_data_list: List[Any], source_type: str = "auto") -> List[Dict[str, Any]]:
        """Normalize multiple transactions at once"""
        normalized = []
        
        for raw in raw_data_list:
            try:
                normalized.append(self.normalize(raw, source_type))
            except Exception as e:
                print(f" Skipping invalid entry: {str(e)}")
                continue
        
        return normalized
    
    def _detect_source_type(self, data: Any) -> str:
        """Auto-detect input data type"""
        if isinstance(data, dict):
            return "json"
        elif isinstance(data, list):
            return "csv"
        elif isinstance(data, str):
            if "invoice" in data.lower() or "bill" in data.lower():
                return "pdf"
            elif "@" in data or "from:" in data.lower():
                return "email"
            else:
                return "ocr"
        return "json"
    
    def _normalize_json(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize JSON/dict input"""
        return {
            "id": self._extract_id(data),
            "vendor": self._extract_vendor(data),
            "amount": self._extract_amount(data),
            "utr": self._extract_utr(data),
            "date": self._extract_date(data),
            "mode": self._extract_mode(data),
            "type": self._extract_type(data),
            "gst": self._extract_gst(data),
            "category": self._extract_category(data)
        }
    
    def _normalize_csv(self, data: Any) -> Dict[str, Any]:
        """Normalize CSV row input"""
        if isinstance(data, str):
            # Parse CSV string
            parts = data.split(',')
            data = {f"col_{i}": part.strip() for i, part in enumerate(parts)}
        elif isinstance(data, list):
            data = {f"col_{i}": val for i, val in enumerate(data)}
        
        return self._normalize_json(data)
    
    def _normalize_text(self, text: str) -> Dict[str, Any]:
        """Normalize raw text (OCR, PDF, Email)"""
        # Extract all information from unstructured text
        extracted = {
            "vendor": self._extract_vendor_from_text(text),
            "amount": self._extract_amount_from_text(text),
            "utr": self._extract_utr_from_text(text),
            "date": self._extract_date_from_text(text),
            "mode": self._extract_mode_from_text(text),
            "type": self._extract_type_from_text(text),
            "gst": self._extract_gst_from_text(text),
            "category": self._extract_category_from_text(text)
        }
        
        extracted["id"] = self._generate_id()
        
        return extracted
    
    
    def _extract_id(self, data: Dict) -> str:
        """Extract or generate transaction ID"""
        for key in ["id", "transaction_id", "txn_id", "ref_no", "reference"]:
            if key in data and data[key]:
                return str(data[key])
        return self._generate_id()
    
    def _generate_id(self) -> str:
        """Generate unique transaction ID"""
        return f"TXN_{uuid.uuid4().hex[:8].upper()}"
    
    def _extract_vendor(self, data: Dict) -> str:
        """Extract vendor name"""
        for key in ["vendor", "party", "supplier", "merchant", "payee", "to", "beneficiary", "name"]:
            if key in data and data[key]:
                return str(data[key]).strip()
        return "Unknown Vendor"
    
    def _extract_vendor_from_text(self, text: str) -> str:
        """Extract vendor from unstructured text"""
        patterns = [
            r"(?:to|payee|vendor|merchant)[:|\s]+([A-Za-z\s&.]+)",
            r"M/s\.?\s+([A-Za-z\s&.]+)",
            r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+(?:Pvt|Ltd|LLP)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "Unknown Vendor"
    
    def _extract_amount(self, data: Dict) -> float:
        """Extract amount as float"""
        for key in ["amount", "value", "total", "sum", "debit", "credit", "txn_amount"]:
            if key in data:
                try:
                    val = str(data[key]).replace(',', '').replace('₹', '').replace('Rs', '').strip()
                    return abs(float(val))
                except:
                    continue
        return 0.0
    
    def _extract_amount_from_text(self, text: str) -> float:
        """Extract amount from text"""
        matches = self.amount_pattern.findall(text)
        if matches:
            try:
                amounts = [float(m.replace(',', '')) for m in matches]
                return max(amounts)
            except:
                pass
        return 0.0
    
    def _extract_utr(self, data: Dict) -> Optional[str]:
        """Extract UTR/reference number"""
        for key in ["utr", "ref", "reference", "txn_ref", "transaction_ref", "ref_no"]:
            if key in data and data[key]:
                return str(data[key])
        
        for value in data.values():
            if isinstance(value, str):
                match = self.utr_pattern.search(value)
                if match:
                    return match.group(0)
        
        return None
    
    def _extract_utr_from_text(self, text: str) -> Optional[str]:
        """Extract UTR from text"""
        match = self.utr_pattern.search(text)
        return match.group(0) if match else None
    
    def _extract_date(self, data: Dict) -> str:
        """Extract and normalize date to ISO 8601"""
        for key in ["date", "txn_date", "transaction_date", "timestamp", "datetime"]:
            if key in data and data[key]:
                return self._parse_date(data[key])
        return datetime.now().isoformat()
    
    def _extract_date_from_text(self, text: str) -> str:
        """Extract date from text"""
        date_patterns = [
            r'\d{2}[-/]\d{2}[-/]\d{4}',  # DD-MM-YYYY or DD/MM/YYYY
            r'\d{4}[-/]\d{2}[-/]\d{2}',  # YYYY-MM-DD
            r'\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}',
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(0))
        
        return datetime.now().isoformat()
    
    def _parse_date(self, date_str: Any) -> str:
        """Parse any date format to ISO 8601"""
        if not date_str:
            return datetime.now().isoformat()
        
        date_str = str(date_str)
        
        formats = [
            "%Y-%m-%d",
            "%d-%m-%Y",
            "%d/%m/%Y",
            "%Y/%m/%d",
            "%d-%m-%y",
            "%d %B %Y",
            "%d %b %Y",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M:%S",
        ]
        
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str, fmt)
                return dt.isoformat()
            except:
                continue
        
        return datetime.now().isoformat()
    
    def _extract_mode(self, data: Dict) -> str:
        """Extract payment mode"""
        for key in ["mode", "payment_mode", "method", "type", "channel"]:
            if key in data:
                mode = str(data[key]).upper()
                for supported in self.supported_modes:
                    if supported in mode:
                        return supported
        return "BANK_TRANSFER"
    
    def _extract_mode_from_text(self, text: str) -> str:
        """Extract payment mode from text"""
        text_upper = text.upper()
        for mode in self.supported_modes:
            if mode in text_upper:
                return mode
        return "BANK_TRANSFER"
    
    def _extract_type(self, data: Dict) -> str:
        """Extract transaction type (credit/debit)"""
        for key in ["type", "txn_type", "transaction_type", "cr_dr"]:
            if key in data:
                val = str(data[key]).lower()
                if "credit" in val or "cr" in val or "received" in val:
                    return "credit"
                if "debit" in val or "dr" in val or "paid" in val or "payment" in val:
                    return "debit"
        
        for key in ["amount", "value"]:
            if key in data:
                try:
                    amount = float(str(data[key]).replace(',', '').replace('₹', ''))
                    return "credit" if amount > 0 else "debit"
                except:
                    pass
        
        return "debit"
    
    def _extract_type_from_text(self, text: str) -> str:
        """Extract transaction type from text"""
        text_lower = text.lower()
        if any(word in text_lower for word in ["received", "credit", "deposited", "cr"]):
            return "credit"
        if any(word in text_lower for word in ["paid", "debit", "withdrawn", "dr", "payment"]):
            return "debit"
        return "debit"
    
    def _extract_gst(self, data: Dict) -> Optional[Dict[str, Any]]:
        """Extract GST information"""
        gst_info = {}
        
        for key in ["gst_rate", "gst", "tax_rate", "igst", "cgst", "sgst"]:
            if key in data and data[key]:
                try:
                    rate = float(str(data[key]).replace('%', ''))
                    gst_info["rate"] = int(rate)
                    break
                except:
                    pass
        
        for key in ["gst_amount", "tax_amount", "gst_value", "tax"]:
            if key in data and data[key]:
                try:
                    gst_info["amount"] = float(str(data[key]).replace(',', ''))
                    break
                except:
                    pass
        
        for key in ["gstin", "gst_number", "gst_no"]:
            if key in data and data[key]:
                gstin = str(data[key])
                if self.gstin_pattern.match(gstin):
                    gst_info["gstin"] = gstin
                    break
        
        return gst_info if gst_info else None
    
    def _extract_gst_from_text(self, text: str) -> Optional[Dict[str, Any]]:
        """Extract GST from text"""
        gst_info = {}
        
        gstin_match = self.gstin_pattern.search(text)
        if gstin_match:
            gst_info["gstin"] = gstin_match.group(0)
        
        gst_rate_match = re.search(r'GST\s*[@:]\s*(\d+)%', text, re.IGNORECASE)
        if gst_rate_match:
            gst_info["rate"] = int(gst_rate_match.group(1))
        
        gst_amount_match = re.search(r'GST[:\s]*(?:Rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)', text, re.IGNORECASE)
        if gst_amount_match:
            gst_info["amount"] = float(gst_amount_match.group(1).replace(',', ''))
        
        return gst_info if gst_info else None
    
    def _extract_category(self, data: Dict) -> Optional[str]:
        """Extract transaction category"""
        for key in ["category", "type", "purpose", "description", "narration"]:
            if key in data and data[key]:
                return str(data[key])
        return None
    
    def _extract_category_from_text(self, text: str) -> Optional[str]:
        """Extract category from text keywords"""
        text_lower = text.lower()
        
        categories = {
            "supplies": ["supplies", "material", "goods", "inventory"],
            "salary": ["salary", "wages", "payroll", "compensation"],
            "rent": ["rent", "lease"],
            "utilities": ["electricity", "water", "internet", "telecom"],
            "services": ["service", "consulting", "professional"],
            "equipment": ["equipment", "machinery", "tools"],
        }
        
        for category, keywords in categories.items():
            if any(kw in text_lower for kw in keywords):
                return category
        
        return None
    
    def _create_safe_default(self) -> Dict[str, Any]:
        """Create safe default transaction when parsing fails"""
        return {
            "id": self._generate_id(),
            "vendor": "Unknown Vendor",
            "amount": 0.0,
            "utr": None,
            "date": datetime.now().isoformat(),
            "mode": "BANK_TRANSFER",
            "type": "debit",
            "gst": None,
            "category": None
        }
    
    def validate_normalized(self, transaction: Dict[str, Any]) -> bool:
        """Validate that normalized transaction has all required fields"""
        required = ["id", "vendor", "amount", "date", "mode", "type"]
        return all(key in transaction for key in required)


if __name__ == "__main__":
    normalizer = DataNormalizerAgent()
    
    print("=" * 60)
    print("TEST 1: JSON Input")
    print("=" * 60)
    json_data = {
        "transaction_id": "TX123",
        "payee": "ABC Suppliers Pvt Ltd",
        "amount": "25,000.00",
        "ref": "UTR987654321",
        "date": "15-11-2025",
        "mode": "UPI"
    }
    result = normalizer.normalize(json_data)
    print(json.dumps(result, indent=2))
    
    print("\n" + "=" * 60)
    print("TEST 2: OCR Text Input")
    print("=" * 60)
    ocr_text = """
    INVOICE
    From: XYZ Electronics Ltd
    Amount: Rs. 45,000
    Date: 16-11-2025
    UTR: UTR123ABC456
    Payment Mode: NEFT
    GST @ 18%: Rs. 8,100
    """
    result = normalizer.normalize(ocr_text, source_type="ocr")
    print(json.dumps(result, indent=2))
    
    print("\n" + "=" * 60)
    print("TEST 3: CSV Input")
    print("=" * 60)
    csv_row = "TXN456,Supplier ABC,12000,2025-11-17,UPI,debit"
    result = normalizer.normalize(csv_row, source_type="csv")
    print(json.dumps(result, indent=2))