"""
Generate AES-256 encryption key
"""
import os
import base64

def generate_key():
    key = os.urandom(32)  # 256 bits
    key_b64 = base64.b64encode(key).decode('utf-8')
    print("=" * 60)
    print("NEW AES-256 ENCRYPTION KEY")
    print("=" * 60)
    print(f"\n{key_b64}\n")
    print("=" * 60)
    print("\nAdd this to your .env file:")
    print(f"ENCRYPTION_KEY={key_b64}")
    print("=" * 60)
    return key_b64

if __name__ == "__main__":
    generate_key()
