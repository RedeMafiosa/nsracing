{
  "name": "LiveStream",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Stream title"
    },
    "streamer_name": {
      "type": "string",
      "description": "Name of the streamer"
    },
    "platform": {
      "type": "string",
      "enum": [
        "twitch",
        "youtube",
        "kick"
      ],
      "default": "twitch"
    },
    "embed_url": {
      "type": "string",
      "description": "Embed URL for the stream"
    },
    "channel_url": {
      "type": "string",
      "description": "Direct link to the channel"
    },
    "thumbnail_url": {
      "type": "string",
      "description": "Thumbnail image URL"
    },
    "is_live": {
      "type": "boolean",
      "default": false
    },
    "viewers": {
      "type": "number",
      "default": 0
    },
    "rank": {
      "type": "number",
      "default": 0
    },
    "category": {
      "type": "string",
      "enum": [
        "formula1",
        "rally",
        "gt",
        "nascar",
        "endurance",
        "drift",
        "other"
      ],
      "default": "formula1"
    },
    "description": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "streamer_name"
  ]
}