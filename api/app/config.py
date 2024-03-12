import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    @property
    def cors_origins(self):
        return (os.getenv("CORS_ORIGINS") or "*").split(",")

    @property
    def database_url(self):
        return os.getenv("DATABASE_URL")
    
    @property
    def openai_api_key(self):
        return os.getenv("OPENAI_API_KEY")


config = Config()
