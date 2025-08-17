from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .tag_dto import TagDto, TagDtoSchema
from .id import ID


@dataclass
class QuizDto:
    id: str
    title: str
    description: str | None
    tags: list[TagDto]


class QuizDtoSchema(Schema):
    id = ID(required=True)
    title = fields.String(required=True)
    description = fields.String(allow_none=True)
    tags = fields.Nested(TagDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs):
        return QuizDto(**data)
