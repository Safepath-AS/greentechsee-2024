from pprint import pprint

from openai import AsyncOpenAI

from .config import config

client = AsyncOpenAI(
  api_key=config.openai_api_key,
)

async def query_gpt(prompt: str) -> str:
  completion = await client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": prompt
      }
    ]
  )
    
  return completion.choices[0].message.content
