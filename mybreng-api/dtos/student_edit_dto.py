from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class StudentEditDto:
    id: str | None
    first_name: str
    last_name: str | None


class StudentEditDtoSchema(Schema):
    id = ID(required=False, load_default=None)
    first_name = fields.String(data_key='firstName', required=True)
    last_name = fields.String(data_key='lastName', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> StudentEditDto:
        return StudentEditDto(**data)
