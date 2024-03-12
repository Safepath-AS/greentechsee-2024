import random

from .config import config
from .utils import haversine

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import session, Hospital, Airport, SarBase

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

@app.get("/hospitals", description="Get all hospitals")
def read_hospitals():
    return session.query(Hospital).all()

@app.get("/hospitals/closest", description="Get the closest hospital to a given location")
def read_closest_hospital(lat: float, lon: float):
    # Fetch all hospitals from the database
    hospitals = session.query(Hospital).all()

    # Initialize the minimum distance and the closest hospital
    min_distance = float('inf')
    closest_hospital = None

    # Iterate over all hospitals
    for hospital in hospitals:
        # Calculate the distance to the current hospital
        distance = haversine(lon, lat, hospital.longitude, hospital.latitude)

        # If the calculated distance is smaller than the current minimum distance
        if distance < min_distance:
            # Update the minimum distance and the closest hospital
            min_distance = distance
            closest_hospital = hospital

    # Return the closest hospital
    return closest_hospital

@app.get("/airports", description="Get all airports")
def read_airports():
    return session.query(Airport).all()

@app.get("/airports/closest", description="Get the closest airport to a given location")
def read_closest_airport(lat: float, lon: float):
    airports = session.query(Airport).all()
    min_distance = float('inf')
    closest_airport = None
    for airport in airports:
        distance = haversine(lon, lat, airport.longitude, airport.latitude)
        if distance < min_distance:
            min_distance = distance
            closest_airport = airport
    return closest_airport

@app.get("/sar_bases", description="Get all Sar bases")
def read_sar_bases():
    return session.query(SarBase).all()

@app.get("/sar_bases/closest", description="Get the closest Sar base to a given location")
def read_closest_sar_base(lat: float, lon: float):
    sar_bases = session.query(SarBase).all()
    min_distance = float('inf')
    closest_sar_base = None
    for sar_base in sar_bases:
        distance = haversine(lon, lat, sar_base.longitude, sar_base.latitude)
        if distance < min_distance:
            min_distance = distance
            closest_sar_base = sar_base
    return closest_sar_base
