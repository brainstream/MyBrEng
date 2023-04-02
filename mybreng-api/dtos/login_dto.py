from dataclasses import dataclass
from marshmallow import Schema, fields


@dataclass
class LogInDto:
    email: str
    password: str


class LogInDtoSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
