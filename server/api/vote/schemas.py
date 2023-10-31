from pydantic import BaseModel


class VoteResponse(BaseModel):
    article_id: str
    user_id: str

    class Config:
        orm_mode = True


class VoteOutcome(BaseModel):
    message: str

    class Config:
        orm_mode = True


