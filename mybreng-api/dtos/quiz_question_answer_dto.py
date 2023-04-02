from dataclasses import dataclass
from marshmallow import Schema, fields


@dataclass()
class QuizQuestionAnswerDto:
    id: str
    text: str
    is_correct: bool


class QuizQuestionAnswerDtoSchema(Schema):
    id = fields.UUID(required=True)
    text = fields.String(required=True)
    is_correct = fields.Boolean(required=True)
