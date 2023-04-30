from dataclasses import dataclass

from marshmallow import Schema, fields


@dataclass()
class StudentDto:
    id: str
    first_name: str
    last_name: str


class StudentDtoSchema(Schema):
    id = fields.UUID(required=True)
    first_name = fields.String(data_key='firstName', required=True)
    last_name = fields.String(data_key='lastName', allow_none=True)
