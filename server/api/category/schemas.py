from pydantic import BaseModel


class CategorySchema(BaseModel):
    name: str


class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
