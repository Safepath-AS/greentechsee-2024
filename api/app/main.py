import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "GreenTech!"}

@app.get("/test-cd")
def read_root():
    return {"Test": "CD"}

@app.get("/random")
def read_root():
    return random.randint(0, 100)
