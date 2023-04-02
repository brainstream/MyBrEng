from dataclasses import dataclass
from marshmallow import Schema, fields
from flask_login import UserMixin


@dataclass
class UserDto(UserMixin):
    id: str
    email: str


class UserDtoSchema(Schema):
    id = fields.UUID(required=True)
    email = fields.String(required=True)
