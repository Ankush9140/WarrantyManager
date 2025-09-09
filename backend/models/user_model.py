from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    email: str
    password: str

class UserInDB(User):
    hashed_password: str
    password: Optional[str] = None
