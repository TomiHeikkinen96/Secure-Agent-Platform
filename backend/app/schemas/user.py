from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    display_name: str
    email: EmailStr
    avatar_url: str | None
    role: str
    entra_object_id: str | None
    created_at: datetime
    updated_at: datetime
