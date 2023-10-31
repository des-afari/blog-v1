from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base
from utils.config import settings
from sqlalchemy.orm import sessionmaker


MYSQL_DATABASE_URL = URL.create(
    drivername=settings.DB_DRIVERNAME,
    username=settings.DB_USERNAME,
    password=settings.DB_PASSWORD,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    database=settings.DB_DATABASE
)

engine = create_engine(MYSQL_DATABASE_URL)
SessionLocal = sessionmaker(engine)
Base = declarative_base()