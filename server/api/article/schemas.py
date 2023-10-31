from pydantic import BaseModel
from typing import List, Union
from datetime import datetime
from api.category.schemas import CategoryResponse
from api.comment.schemas import CommentResponse
from api.vote.schemas import VoteResponse


class ArticleSchema(BaseModel):
    img_url: str
    title: str
    description: str
    content: str
    categories: List[str]


class ArticleUpdateSchema(BaseModel):
    img_url: str
    title: str
    description: str
    content: str


class ArticleResponse(BaseModel):
    id: str
    img_url: str
    title: str
    description: str
    content: str
    created_at: datetime
    updated_at: Union[datetime, None]
    categories: List[CategoryResponse]
    comments: List[CommentResponse]
    votes: List[VoteResponse]

    class Config:
        orm_mode = True
