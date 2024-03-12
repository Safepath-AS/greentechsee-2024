import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import config
from .openai import query_gpt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def query(query: str):
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

    response = await query_gpt(query)
    return {
        'author': 'AI',
        'content': response,
    }


@app.get("/random")
def read_random():
    return random.randint(0, 100)
