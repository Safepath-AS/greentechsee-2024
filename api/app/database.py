from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from .config import config

Base = automap_base()

engine = create_engine(config.database_url) if config.database_url else None

if engine:
  Base.prepare(engine, reflect=True)

# Define the models
Hospital = Base.classes.hospitals if engine else None
Airport = Base.classes.airports if engine else None
SarBase = Base.classes.sar_bases if engine else None
EmergencyPort = Base.classes.emergency_ports if engine else None
EmergencyDepot = Base.classes.emergency_depots if engine else None
Attribute = Base.classes.attributes if engine else None

session = Session(engine) if engine else None
