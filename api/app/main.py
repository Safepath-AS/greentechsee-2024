import random

from pydantic import BaseModel
from .utils import haversine

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from typing import Tuple, Type, List, Optional
from sqlalchemy.orm import Query
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy import and_, or_

from .config import config
from .openai import query_gpt
from .api_models import HistoryMessage

from .database import session, Hospital, Airport, SarBase, EmergencyPort, EmergencyDepot, Attribute
from .models import HospitalModel, AirportModel, SarBaseModel, EmergencyPortModel, EmergencyDepotModel


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
    if not response:
        return {
            'type': 'message',
            'author': 'AI',
            'content': 'Sorry, I cannot respond at the moment.',
        }

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


def get_closest_entity(lat: float, lon: float, query: Query, entity: Type[DeclarativeMeta], has_helipad: Optional[bool] = None):
    attributes = []
    if has_helipad is not None:
        helipad_subquery = session.query(entity.id).join(Attribute, entity.id == Attribute.entity_id).filter(and_(Attribute.attribute_name == 'helipad', Attribute.attribute_value == str(has_helipad).lower())).subquery()
        attributes.append(helipad_subquery)

    if attributes:
        entities = session.query(entity).filter(entity.id.in_(attributes[0]))
        for attribute in attributes[1:]:
            entities = entities.filter(entity.id.in_(attribute))
        entities = entities.all()
        if not entities:
            raise HTTPException(status_code=404, detail="No entity found with the requested attributes")
    else:
        entities = query.all()

    min_distance = float('inf')
    closest_entity = None
    for entity in entities:
        distance = haversine(lon, lat, entity.longitude, entity.latitude)
        if distance < min_distance:
            min_distance = distance
            closest_entity = entity
    return closest_entity


def assert_db():
    if not session:
        raise ValueError("Database not available")


@app.get("/hospitals", response_model=List[HospitalModel], description="Get all hospitals")
def read_hospitals():
    assert_db()
    return session.query(Hospital).all()


@app.get("/hospitals/closest", response_model=HospitalModel, description="Get the closest hospital to a given location")
def read_closest_hospital(lat: float, lon: float, has_helipad: Optional[bool] = None):
    assert_db()
    return get_closest_entity(lat, lon, session.query(Hospital), Hospital, has_helipad)


@app.get("/airports", response_model=List[AirportModel], description="Get all airports")
def read_airports():
    assert_db()
    return session.query(Airport).all()


@app.get("/airports/closest", response_model=AirportModel, description="Get the closest airport to a given location")
def read_closest_airport(lat: float, lon: float):
    assert_db()
    return get_closest_entity(lat, lon, session.query(Airport), Airport)


@app.get("/sar_bases", response_model=List[SarBaseModel], description="Get all Sar bases")
def read_sar_bases():
    assert_db()
    return session.query(SarBase).all()


@app.get("/sar_bases/closest", response_model=SarBaseModel, description="Get the closest Sar base to a given location")
def read_closest_sar_base(lat: float, lon: float):
    assert_db()
    return get_closest_entity(lat, lon, session.query(SarBase), SarBase)


@app.get("/emergency_ports", response_model=List[EmergencyPortModel], description="Get all emergency ports")
def read_emergency_ports():
    assert_db()
    return session.query(EmergencyPort).all()


@app.get("/emergency_ports/closest", response_model=EmergencyPortModel, description="Get the closest emergency port to a given location")
def read_closest_emergency_port(lat: float, lon: float):
    assert_db()
    return get_closest_entity(lat, lon, session.query(EmergencyPort), EmergencyPort)


@app.get("/emergency_depots", response_model=List[EmergencyDepotModel], description="Get all emergency depots")
def read_emergency_depots():
    assert_db()
    return session.query(EmergencyDepot).all()


@app.get("/emergency_depots/closest", response_model=EmergencyDepotModel, description="Get the closest emergency depot to a given location")
def read_closest_emergency_depot(lat: float, lon: float):
    assert_db()
    return get_closest_entity(lat, lon, session.query(EmergencyDepot), EmergencyDepot)
