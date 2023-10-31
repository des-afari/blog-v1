from pydantic import BaseModel
from datetime import datetime
from typing import Union


class CommentSchema(BaseModel):
    comment: str


class CommentUserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


class CommentResponse(BaseModel):
    id: int
    comment: str
    created_at: datetime
    updated_at: Union[datetime, None]
    user: CommentUserResponse

    class Config:
        orm_mode = True
