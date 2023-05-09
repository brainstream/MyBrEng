from dataclasses import dataclass
from marshmallow import Schema, fields, post_load


@dataclass
class LoginDto:
    email: str
    password: str


class LogInDtoSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> LoginDto:
        return LoginDto(**data)
