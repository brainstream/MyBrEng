from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .tag_dto import TagDto, TagDtoSchema
from .id import ID


@dataclass
class StudentDto:
    id: str
    first_name: str
    last_name: str
    tags: list[TagDto]


class StudentDtoSchema(Schema):
    id = ID(required=True)
    first_name = fields.String(data_key='firstName', required=True)
    last_name = fields.String(data_key='lastName', allow_none=True)
    tags = fields.Nested(TagDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs) -> StudentDto:
        return StudentDto(**data)
