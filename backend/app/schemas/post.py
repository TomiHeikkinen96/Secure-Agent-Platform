from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PostCreate(BaseModel):
    author_id: int
    content: str = Field(min_length=1, max_length=2000)


class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_id: int
    content: str
    created_at: datetime
    updated_at: datetime
