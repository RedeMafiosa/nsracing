{
  "name": "SupportTicket",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "subject": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "open",
        "in_progress",
        "resolved"
      ],
      "default": "open"
    }
  },
  "required": [
    "name",
    "email",
    "subject",
    "message"
  ]
}