from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from flask_login import UserMixin
from .id import ID


@dataclass
class UserDto(UserMixin):
    id: str
    email: str


class UserDtoSchema(Schema):
    id = ID(required=True)
    email = fields.Email(required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> UserDto:
        return UserDto(**data)

