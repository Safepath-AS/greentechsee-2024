import random
from .utils import haversine

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from typing import Type, List
from sqlalchemy.orm import Query
from sqlalchemy.ext.declarative import DeclarativeMeta

from .config import config
from .openai import query_gpt
from .api_models import HistoryMessage

from .database import session, Hospital, Airport, SarBase
from .models import HospitalModel, AirportModel, SarBaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
async def query(query: str, history: list[HistoryMessage] = []):
    '''Query for some data.'''
    if 'we are sinking' in query.lower():
        return {
            'type': 'message',
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

    response = await query_gpt(query, history)
    if response["type"] == "function":
        return {
            'type': 'function',
            'function': response['function'],
            'arguments': response['arguments'],
        }

    return {
        'type': 'message',
        'author': 'AI',
        'content': response['message'],
    }


@app.get("/random")
def read_random():
    return random.randint(0, 100)

def get_closest_entity(lat: float, lon: float, query: Query, entity: Type[DeclarativeMeta]):
    entities = query.all()
    min_distance = float('inf')
    closest_entity = None
    for entity in entities:
        distance = haversine(lon, lat, entity.longitude, entity.latitude)
        if distance < min_distance:
            min_distance = distance
            closest_entity = entity
    return closest_entity

@app.get("/hospitals", response_model=List[HospitalModel], description="Get all hospitals")
def read_hospitals():
    return session.query(Hospital).all()


@app.get("/hospitals/closest", response_model=HospitalModel, description="Get the closest hospital to a given location")
def read_closest_hospital(lat: float, lon: float):
    return get_closest_entity(lat, lon, session.query(Hospital), Hospital)


@app.get("/airports", response_model=List[AirportModel], description="Get all airports")
def read_airports():
    return session.query(Airport).all()


@app.get("/airports/closest", response_model=AirportModel, description="Get the closest airport to a given location")
def read_closest_airport(lat: float, lon: float):
    return get_closest_entity(lat, lon, session.query(Airport), Airport)


@app.get("/sar_bases", response_model=List[SarBaseModel], description="Get all Sar bases")
def read_sar_bases():
    return session.query(SarBase).all()


@app.get("/sar_bases/closest", response_model=SarBaseModel, description="Get the closest Sar base to a given location")
def read_closest_sar_base(lat: float, lon: float):
    return get_closest_entity(lat, lon, session.query(SarBase), SarBase)
