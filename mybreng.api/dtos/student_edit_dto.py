from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class StudentEditDto:
    first_name: str
    last_name: str | None
    id: str | None = field(default=None)
    tags: list[str] | None = field(default=None)


class StudentEditDtoSchema(Schema):
    id = ID(required=False)
    first_name = fields.String(data_key='firstName', required=True)
    last_name = fields.String(data_key='lastName', required=False)
    tags = fields.List(ID(), required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> StudentEditDto:
        return StudentEditDto(**data)
