from marshmallow import Schema, fields, post_load
from dataclasses import dataclass
from .id import ID


@dataclass
class QuizEditDto:
    id: str | None
    title: str
    description: str | None


class QuizEditDtoSchema(Schema):
    id = ID(required=False)
    title = fields.String(required=True)
    description = fields.String(required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizEditDto:
        return QuizEditDto(**data)
