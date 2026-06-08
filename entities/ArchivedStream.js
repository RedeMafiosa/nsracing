{
  "name": "ArchivedStream",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "streamer_name": {
      "type": "string"
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
    "video_url": {
      "type": "string"
    },
    "thumbnail_url": {
      "type": "string"
    },
    "views": {
      "type": "number",
      "default": 0
    },
    "duration": {
      "type": "string",
      "description": "Duration of the stream e.g. 2h 30m"
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
    "rank_position": {
      "type": "number",
      "default": 0
    },
    "stream_date": {
      "type": "string",
      "format": "date"
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