import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    def __init__(self):
        self.cors_origins = (os.getenv("CORS_ORIGINS") or "*").split(",")


config = Config()
