from openai import BaseModel

class HistoryMessage(BaseModel):
    author: str
    content: str
