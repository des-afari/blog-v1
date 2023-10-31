from fastapi import APIRouter
from .auth.router import router as auth_router
from .category.router import router as category_router
from .article.router import router as article_router
from .comment.router import router as comment_router
from .vote.router import router as vote_router


api_router = APIRouter(prefix='/api/v1')
api_router.include_router(auth_router, tags=['auth'])
api_router.include_router(category_router, tags=['category'], prefix='/category')
api_router.include_router(article_router, tags=['article'], prefix='/article')
api_router.include_router(comment_router, tags=['comment'], prefix='/comment')
api_router.include_router(vote_router, tags=['vote'])