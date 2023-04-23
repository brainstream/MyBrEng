from dataclasses import dataclass
from marshmallow import Schema, fields, post_load


@dataclass
class QuizQuestionPositionDto:
    id: str
    index: int


class QuizQuestionPositionDtoSchema(Schema):
    id = fields.UUID(required=True)
    index = fields.Integer(required=True)

    @post_load
    def make_dto(self, data, **kwargs):
        return QuizQuestionPositionDto(
            str(data['id']),
            data['index']
        )
