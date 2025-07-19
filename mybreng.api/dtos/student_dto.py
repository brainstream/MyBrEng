from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class StudentDto:
    id: str
    first_name: str
    last_name: str


class StudentDtoSchema(Schema):
    id = ID(required=True)
    first_name = fields.String(data_key='firstName', required=True)
    last_name = fields.String(data_key='lastName', allow_none=True)

    @post_load
    def make_dto(self, data, **kwargs) -> StudentDto:
        return StudentDto(**data)
