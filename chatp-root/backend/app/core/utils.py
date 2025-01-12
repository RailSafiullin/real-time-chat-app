
from datetime import datetime, timezone
from uuid import uuid4
import hashlib

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

#  Get current time
def datetime_now() -> datetime:
    return datetime.now(timezone.utc)


# Generate a random UUID
def get_uuid4() -> str:
    return uuid4().hex


