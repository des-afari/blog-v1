from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.session import get_db
from api.auth.oauth2 import get_user
from .model import Comment
from .schemas import CommentSchema, CommentResponse
from api.article.model import Article
from api.auth.model import User

router = APIRouter()


@router.post('/{article_id}/create', status_code=201, response_model=CommentResponse)
async def create_comment(
    article_id: str, schema: CommentSchema, db: Session = Depends(get_db), user = Depends(get_user)
):
    if not db.query(Article).get(article_id):
        raise HTTPException(404, detail='Article not found')
    
    comment = Comment(user_id=user.sub, article_id=article_id, comment=schema.comment)
    comment.user = db.query(User).get(comment.user_id)

    db.add(comment)
    db.commit()

    return comment


@router.delete('/{id}/delete', status_code=204)
async def delete_comment(
	id: int, db: Session = Depends(get_db), user = Depends(get_user)
):
	comment = db.query(Comment).get(id)

	if not comment:
		raise HTTPException(404, detail='Comment not found')

	if user.sub == comment.user_id or user.role == 'admin':
		db.delete(comment)
		db.commit()

	else:
		raise HTTPException(403, detail='Operation not allowed')
