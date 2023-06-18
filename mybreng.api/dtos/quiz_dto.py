from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class QuizDto:
    id: str
    title: str
    description: str | None


class QuizDtoSchema(Schema):
    id = ID(required=True)
    title = fields.String(required=True)
    description = fields.String(allow_none=True)

    @post_load
    def make_dto(self, data, **kwargs):
        return QuizDto(**data)
