from .base import engine, Base
from api.auth.model import User
from api.jti.model import JsonTokenId
from api.category.model import Category
from api.article.model import Article
from api.comment.model import Comment
from api.vote.model import Vote


Base.metadata.create_all(engine)
