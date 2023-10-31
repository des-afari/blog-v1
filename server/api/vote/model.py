from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class Vote(Base):
    __tablename__ = 'votes'

    article_id = Column(String(255), ForeignKey('articles.id'), primary_key=True, nullable=False)
    user_id = Column(String(255), ForeignKey('users.id'), primary_key=True, nullable=False)

    user = relationship('User', back_populates='vote')
    article = relationship('Article', back_populates='votes')

    def __repr__(self) -> str:
        return f"<Vote user_id={self.user_id} article_id={self.article_id} />"
