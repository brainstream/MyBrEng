from dataclasses import dataclass

from flask_login import UserMixin
from marshmallow import Schema, fields, post_load

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
