from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_DRIVERNAME: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_DATABASE: str

    ACCESS_TOKEN_EXPIRES: int
    REFRESH_TOKEN_EXPIRES: int
    ACCESS_KEY: str
    REFRESH_KEY: str

    class Config:
        env_file = '.env'


settings = Settings()
