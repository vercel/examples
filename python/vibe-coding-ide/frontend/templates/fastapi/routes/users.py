from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel


class User(BaseModel):
    id: int
    username: str
    full_name: str | None = None


router = APIRouter()

_users: list[User] = [
    User(id=1, username="alice", full_name="Alice Anderson"),
    User(id=2, username="bob", full_name="Bob Brown"),
]


@router.get("/me", response_model=User)
def read_me() -> User:
    return _users[0]


@router.get("/", response_model=list[User])
def list_users(limit: int = Query(default=50, ge=1, le=100)) -> list[User]:
    return _users[:limit]


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int) -> User:
    for user in _users:
        if user.id == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")
