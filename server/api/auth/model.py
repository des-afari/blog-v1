from sqlalchemy import Column, String, Date, func 
from sqlalchemy.orm import relationship
from db.base import Base


class User(Base):
    __tablename__ = 'users'

    id= Column(String(255), primary_key=True, nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    role = Column(String(5), default='user')
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(Date, default=func.current_date(), nullable=False)
    updated_at = Column(Date, onupdate=func.current_date())

    articles = relationship("Article", back_populates='user', cascade="all, delete-orphan")
    comments = relationship('Comment',back_populates='user', cascade='all, delete-orphan')
    vote = relationship("Vote", back_populates='user')

    def set_slug(self):
        self.first_name = self.first_name.lower().replace(' ', '-')
        self.last_name = self.last_name.lower().replace(' ', '-')

    def __repr__(self) -> str:
        return f"<User last-name={self.last_name} email={self.email} />"
