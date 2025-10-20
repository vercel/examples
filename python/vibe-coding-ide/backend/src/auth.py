import os
import jwt
from typing import Any

from datetime import datetime, timedelta, timezone
from fastapi.exceptions import HTTPException


# JWT configuration (kept compatible with existing environment variables)
JWT_SECRET: str = os.getenv("JWT_SECRET", os.getenv("SSE_SECRET", "dev-secret"))
JWT_ALG: str = "HS256"
JWT_TTL_SECONDS: int = int(os.getenv("RESUME_TOKEN_TTL_SECONDS", "600"))


def make_stream_token(payload: dict[str, Any]) -> str:
    """Create a signed JWT used by the SSE stream for resuming agent runs.

    The token embeds the provided payload and standard claims (iat/exp).
    """
    now = datetime.now(timezone.utc)
    to_encode = {
        **payload,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=JWT_TTL_SECONDS)).timestamp()),
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALG)


def read_stream_token(token: str) -> dict[str, Any]:
    """Decode and validate a previously issued resume token.

    Removes standard claims before returning the decoded payload.
    Raises HTTP 400 on expired/invalid tokens to match previous behavior.
    """
    try:
        decoded: dict[str, Any] = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        decoded.pop("iat", None)
        decoded.pop("exp", None)
        return decoded
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")
