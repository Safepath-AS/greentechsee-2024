from pprint import pprint

from openai import AsyncOpenAI

from .config import config
from .api_models import HistoryMessage

client = AsyncOpenAI(
  api_key=config.openai_api_key,
) if config.openai_api_key else None


system = '''
Your role is to assist a captain in need aboard a seafaring vessel in finding nearby emergency
resources for when the vessel is in distress. Your tools include the ability to find the nearby
emergency resources.

Reply in Norwegian or English.
'''

tools = [
  {
    "type": "function",
    "function": {
      "name": "get_closest_hospital",
      "description": "Displays the closest hospital to a given location. Omit the latitude and longitude if the user asks for their own position.",
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
      "description": "Displays the closest airport to a given location. Omit the latitude and longitude if the user asks for their own position.",
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
      "description": "Displays the closest searh and rescue helicopter base to a given location. Omit the latitude and longitude if the user asks for their own position.",
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
      "description": "Displays the closest searh and rescue helicopter base to a given location. Omit the latitude and longitude if the user asks for their own position.",
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
      "name": "get_closest_emergency_port",
      "description": "Displays the closest emergency port to a given location. Omit the latitude and longitude if the user asks for their own position.",
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
      "name": "get_closest_emergency_depot",
      "description": "Displays the closest emergency oilspill depot to a given location. Omit the latitude and longitude if the user asks for their own position.",
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
      "name": "change_language",
      "description": "Let's the user change language. Guess the closest language if the user's language is not supported.",
      "parameters": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string",
            "description": "Norwegian `no` or English `en`",
          },
        },
      },
    },
  },
  # {
  #   "type": "function",
  #   "function": {
  #     "name": "get_user_location",
  #     "description": "Displays the user's location. NOTE: Must only be used if the user explicitly asks to see their current location.",
  #   },
  # },
]

async def query_gpt(prompt: str, history: list[HistoryMessage]) -> str | None:
  '''Query GPT for a response.'''
  if not client:
    return None

  messages = [
    {
      "role": "system",
      "content": system,
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
    tools=tools,
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
