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
    tools=[
      {
        "type": "function",
        "function": {
          "name": "get_user_location",
          "description": "Get the user's location. This function should be called when the user asks for their own location.",
        },
      },
      {
        "type": "function",
        "function": {
          "name": "get_closest_hospital",
          "description": "Get the closest hospital to a given location. Omit the latitude and longitude if the user asks for their own position.",
          "parameters": {
            "type": "object",
            "properties": {
              "latitude": {
                "type": "number",
                "description": "The latitude of the user's location.",
              },
              "longitude": {
                "type": "number",
                "description": "The longitude of the user's location.",
              },
            },
          },
        },
      },
      {
        "type": "function",
        "function": {
          "name": "get_closest_airport",
          "description": "Get the closest airport to a given location. Omit the latitude and longitude if the user asks for their own position.",
          "parameters": {
            "type": "object",
            "properties": {
              "latitude": {
                "type": "number",
                "description": "The latitude of the user's location.",
              },
              "longitude": {
                "type": "number",
                "description": "The longitude of the user's location.",
              },
            },
          },
        },
      },
      {
        "type": "function",
        "function": {
          "name": "get_closest_sar_base",
          "description": "Get the closest searh and rescue helicopter base to a given location. Omit the latitude and longitude if the user asks for their own position.",
          "parameters": {
            "type": "object",
            "properties": {
              "latitude": {
                "type": "number",
                "description": "The latitude of the user's location.",
              },
              "longitude": {
                "type": "number",
                "description": "The longitude of the user's location.",
              },
            },
          },
        },
      }
    ],
  )

  choice = completion.choices[0]
  message = choice.message

  if choice.finish_reason == "tool_calls":
    function = message.tool_calls[0].function
    return {
      "type": "function",
      "function": function.name,
      "arguments": function.arguments,
    }

  return {
    "type": "message",
    "message": message.content,
  }
