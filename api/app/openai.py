from pprint import pprint

from openai import AsyncOpenAI

from .config import config
from .api_models import HistoryMessage

client = AsyncOpenAI(
  api_key=config.openai_api_key,
)

async def query_gpt(prompt: str, history: list[HistoryMessage]) -> str:
  '''Query GPT for a response.'''
  messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant. Reply in Norwegian or English.",
    }
  ]

  for message in history:
    messages.append({
      "role": message.author == "AI" and "system" or "user",
      "content": message.content,
    })

  messages.append({
    "role": "user",
    "content": prompt,
  })

  completion = await client.chat.completions.create(
    model="gpt-4-turbo-preview",
    messages=messages,
  )
    
  return completion.choices[0].message.content
