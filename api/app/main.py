import random

from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "GreenTech!"}

@app.get("/test-cd")
def read_root():
    return {"Test": "CD"}

@app.get("/random")
def read_root():
    return random.randint(0, 100)
