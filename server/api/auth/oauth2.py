from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from utils.session import get_db
from utils.config import settings
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from secrets import token_hex
from .schemas import JWTResponse
from api.jti.model import JsonTokenId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


def create_access_token(data: dict):
    to_encode = data.copy()

    to_encode.update({
        'jti': token_hex(),
        'iss': 'https://blog.desmondafari.tech',
        'exp': datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES)
    })

    return jwt.encode(to_encode, key=settings.ACCESS_KEY, algorithm='HS256')


def create_refresh_token(data: dict):
    to_encode = data.copy()

    to_encode.update({
        'jti': token_hex(),
        'iss': 'https://blog.desmondafari.tech',
        'exp': datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRES)
    })

    return jwt.encode(to_encode, key=settings.REFRESH_KEY, algorithm='HS256')


def verify_token(token: str, key: str, credential_exception):
    try:
        payload = jwt.decode(token, key, algorithms=['HS256'])
        sub: str = payload.get('sub')
        jti: str = payload.get('jti')
        role: str = payload.get('role')

        response = JWTResponse(sub=sub, jti=jti, role=role)

    except JWTError:
        raise credential_exception
    
    return response


async def get_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(
        401, detail='Could not validate credentials', headers={"WWW_Authenticate": "Bearer"}
    )

    payload = verify_token(token, settings.ACCESS_KEY, credential_exception)

    if db.query(JsonTokenId).filter(JsonTokenId.id == payload.jti).first():
        raise credential_exception
    
    return payload
