from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Union


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserUpdateSchema(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class PasswordUpdateSchema(BaseModel):
    current_password: str
    new_password: str


class LogoutSchema(BaseModel):
    access_token: Union[str, None]


class JWTResponse(BaseModel):
    sub: str
    jti: str
    role: str

    class Config:
        orm_mode = True


class RefreshResponse(BaseModel):
    id: str
    access_token: str
    role: str

    class Config:
        orm_mode = True


class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: str
    created_at: date
    updated_at: Union[date, None]

    class Config:
        orm_mode = True


class UsersResponse(UserResponse):
    role: str


class AuthResponse(BaseModel):
    id: str
    access_token: str
    role: str
    user: UserResponse


class PasswordUpdateResponse(BaseModel):
    message: str = 'Password updated successfully'