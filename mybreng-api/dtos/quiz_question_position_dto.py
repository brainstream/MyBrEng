from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class QuizQuestionPositionDto:
    id: str
    index: int


class QuizQuestionPositionDtoSchema(Schema):
    id = ID(required=True)
    index = fields.Integer(required=True)

    @post_load
    def make_dto(self, data, **kwargs):
        return QuizQuestionPositionDto(**data)
