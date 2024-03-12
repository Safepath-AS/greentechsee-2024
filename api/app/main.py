import random

from .config import config

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def query(query: str):
    '''Query for some data.'''
    if 'we are sinking' in query.lower():
        return {
            'author': 'AI',
            'content': 'Here is a relevant coordinate for you.',
            'data': {
                'type': 'sinking',
                'location': {
                    'latitude': 40.7128,
                    'longitude': -74.0060
                }
            }
        }

    # TODO: OpenAI query and stuff


@app.get("/random")
def read_root():
    return random.randint(0, 100)
