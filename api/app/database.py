from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from .config import config

Base = automap_base()

engine = create_engine(config.database_url)

Base.prepare(engine, reflect=True)

# Define the models
Hospital = Base.classes.hospitals
Airport = Base.classes.airports
SarBase = Base.classes.sar_bases
EmergencyPort = Base.classes.emergency_ports
EmergencyDepot = Base.classes.emergency_depots
Attribute = Base.classes.attributes

session = Session(engine)
