from marshmallow import Schema, fields, post_load
from dataclasses import dataclass, field
from .id import ID


@dataclass
class QuizEditDto:
    title: str
    description: str | None
    id: str | None = field(default=None)
    tags: list[str] | None = field(default=None)


class QuizEditDtoSchema(Schema):
    id = ID(required=False)
    title = fields.String(required=True)
    description = fields.String(required=False)
    tags = fields.List(ID(), required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizEditDto:
        return QuizEditDto(**data)
