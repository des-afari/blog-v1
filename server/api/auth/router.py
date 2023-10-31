from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from utils.session import get_db
from fastapi.security import OAuth2PasswordRequestForm
from api.jti.model import JsonTokenId
from .model import User
from .schemas import (
    UserSchema, AuthResponse, UserResponse, RefreshResponse, UsersResponse,
    PasswordUpdateSchema, UserUpdateSchema, LogoutSchema, PasswordUpdateResponse
)  
from .oauth2 import create_access_token, create_refresh_token, verify_token, get_user
from .config import hash_password, verify_password
from utils.config import settings
from uuid import uuid4
from typing import List

router = APIRouter()


@router.post('/register', status_code=201, response_model=AuthResponse)
async def register(response: Response, schema: UserSchema, db: Session = Depends(get_db)):
    schema.email = schema.email.lower()

    if db.query(User).filter(User.email == schema.email).first():
        raise HTTPException(409, detail='User already exists')
    
    schema.password = hash_password(schema.password)

    user = User(**schema.dict())
    user.id = str(uuid4())
    user.set_slug()

    db.add(user)
    db.commit()

    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.id, "role": user.role})
    
    # CHANGE IN PRODUCTION
    response.set_cookie(
        key='jwt', value=refresh_token, path='/', secure=True, httponly=True,
        expires=settings.REFRESH_TOKEN_EXPIRES * 60, domain=None, samesite='none'
    )

    return {"id": user.id, "access_token": access_token, "role": user.role, "user": user}


@router.post('/login', status_code=201, response_model=AuthResponse)
async def login(
    response: Response, form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form.username.lower()).first()

    if not user:
        raise HTTPException(400, detail='Invalid credentials')
    
    if not verify_password(form.password, user.password):
        raise HTTPException(400, detail='Invalid credentials')
    
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.id, "role": user.role})
    
    # CHANGE IN PRODUCTION
    response.set_cookie(
        key='jwt', value=refresh_token, path='/', secure=True, httponly=True,
        expires=settings.REFRESH_TOKEN_EXPIRES * 60, domain=None, samesite='none'
    )

    return {"id": user.id, "access_token": access_token, "role": user.role, "user": user}


@router.get('/refresh', status_code=200, response_model=RefreshResponse)
async def refresh(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get('jwt')

    credential_exception = HTTPException(
            401, detail='Could not validate credentials', headers={"WWW_Authenticate": "Bearer"}
        )
    
    if not token:
        raise credential_exception
    
    payload = verify_token(token, settings.REFRESH_KEY, credential_exception)

    if db.query(JsonTokenId).filter(JsonTokenId.id == payload.jti).first():
        raise credential_exception
    
    access_token = create_access_token(data={"sub": payload.sub, "role": payload.role})

    return {"id": payload.sub, "access_token": access_token, "role": payload.role}


@router.post('/logout', status_code=204)
async def logout(
    request: Request, response: Response, schema: LogoutSchema, db: Session = Depends(get_db)
):
    credential_exception = HTTPException(
        401, detail='Could not validate credentials', headers={"WWW_Authenticate": "Bearer"}
    )

    if schema.access_token:
        access_payload = verify_token(schema.access_token, settings.ACCESS_KEY, credential_exception)

        access_jti = JsonTokenId(id=access_payload.jti)
        db.add(access_jti)

    refresh_token = request.cookies.get('jwt')

    if refresh_token:
        refresh_payload = verify_token(refresh_token, settings.REFRESH_KEY, credential_exception)

        refresh_jti = JsonTokenId(id=refresh_payload.jti)
        db.add(refresh_jti)

    db.commit()

    response.delete_cookie('jwt')


@router.get('/users', status_code=200, response_model=List[UsersResponse])
async def get_all_users(db: Session = Depends(get_db), user = Depends(get_user)):
    if not user.role == 'admin':
        raise HTTPException(403, detail='Operation not allowed')

    return db.query(User).all()


@router.delete('/user/{id}/delete', status_code=204)
async def delete_user(id: str, db: Session = Depends(get_db), curr = Depends(get_user)):
    if not curr.role == 'admin':
        raise HTTPException(403, detail='Operation not allowed')

    user = db.query(User).get(id)

    if not user:
        raise HTTPException(404, detail='User not found')

    db.delete(user)
    db.commit()


@router.put('/user/update', status_code=200, response_model=UserResponse)
async def update_user(schema: UserUpdateSchema, db: Session = Depends(get_db), curr = Depends(get_user)):
    user = db.query(User).get(curr.sub)

    if not user:
        raise HTTPException(404, detail='User not found')

    if db.query(User).filter(User.email == schema.email).filter(User.email != user.email).first():
        raise HTTPException(400, detail='Email already registered')

    form = schema.dict(exclude_unset=True)

    for key, value in form.items():
        setattr(user, key, value)

    user.set_slug()

    db.commit()
    db.refresh(user)

    return user


@router.patch('/user/password/update', status_code=200, response_model=PasswordUpdateResponse)
async def update_password(
    schema: PasswordUpdateSchema, db: Session = Depends(get_db), curr = Depends(get_user)
    ):
    user = db.query(User).get(curr.sub)

    if not user:
        raise HTTPException(404, detail='User not found')

    if not verify_password(schema.current_password, user.password):
        raise HTTPException(400, detail='Incorrect password provided')
    
    password = hash_password(schema.new_password)

    user.password = password

    db.commit()
    db.refresh(user)

    return {"message": "Password updated successfully"}
