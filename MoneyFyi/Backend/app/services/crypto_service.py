"""
AES-256-GCM encryption service for MoneyFyi
"""
import os
import base64
import json
import logging
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

logger = logging.getLogger("moneyfyi.backend.crypto")


class EncryptionManager:
    """AES-256-GCM encryption manager"""
    
    def __init__(self, key_b64: str):
        """Initialize with base64-encoded 256-bit key"""
        self.key = base64.b64decode(key_b64)
        if len(self.key) != 32:
            raise ValueError("Key must be 32 bytes (256 bits)")
        self.aesgcm = AESGCM(self.key)
        logger.info("Encryption manager initialized")
    
    def encrypt(self, plaintext: bytes) -> str:
        """
        Encrypt bytes and return base64-encoded ciphertext.
        
        Returns: base64(nonce + ciphertext)
        """
        nonce = os.urandom(12)  # 96-bit nonce for GCM
        ciphertext = self.aesgcm.encrypt(nonce, plaintext, None)
        encrypted = nonce + ciphertext
        return base64.b64encode(encrypted).decode('utf-8')
    
    def decrypt(self, encrypted_b64: str) -> bytes:
        """
        Decrypt base64-encoded ciphertext and return plaintext bytes.
        
        Args:
            encrypted_b64: base64(nonce + ciphertext)
        """
        encrypted = base64.b64decode(encrypted_b64)
        nonce = encrypted[:12]
        ciphertext = encrypted[12:]
        plaintext = self.aesgcm.decrypt(nonce, ciphertext, None)
        return plaintext
    
    def encrypt_json(self, data: dict) -> str:
        """Encrypt a dictionary as JSON"""
        json_str = json.dumps(data)
        return self.encrypt(json_str.encode('utf-8'))
    
    def decrypt_json(self, encrypted_b64: str) -> dict:
        """Decrypt and parse JSON"""
        decrypted = self.decrypt(encrypted_b64)
        return json.loads(decrypted.decode('utf-8'))


# Singleton instance
_encryption_manager = None


def get_encryption_manager():
    """Get or create singleton encryption manager"""
    global _encryption_manager
    if _encryption_manager is None:
        from ..config import settings
        _encryption_manager = EncryptionManager(settings.encryption_key)
    return _encryption_manager
