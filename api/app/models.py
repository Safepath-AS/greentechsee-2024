from pydantic import BaseModel

class PreparednessResourceModel(BaseModel):
    id: int
    name: str
    commune: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = False

class HospitalModel(PreparednessResourceModel):
    has_helipad: bool = False

class AirportModel(PreparednessResourceModel):
    pass

class SarBaseModel(PreparednessResourceModel):
    pass

class EmergencyPortModel(PreparednessResourceModel):
    pass

class EmergencyDepotModel(PreparednessResourceModel):
    pass
