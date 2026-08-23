from dataclasses import dataclass, field

from marshmallow import Schema, fields, post_load

from .id import ID


@dataclass
class QuizQuestionAnswerDto:
    id: str
    text: str
    is_correct: bool
    slot: str | None = field(default=None)


class QuizQuestionAnswerDtoSchema(Schema):
    id = ID(required=True)
    text = fields.String(required=True)
    is_correct = fields.Boolean(data_key='isCorrect', required=True)
    slot = fields.String(required=False, allow_none=True)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizQuestionAnswerDto:
        return QuizQuestionAnswerDto(**data)
