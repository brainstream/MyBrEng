from dataclasses import dataclass
from marshmallow import Schema, fields
from .quiz_question_answer_dto import QuizQuestionAnswerDtoSchema, QuizQuestionAnswerDto
from .quiz_quiestion_type import QuizQuestionType


@dataclass()
class QuizQuestionDto:
    id: str
    text: str
    type: QuizQuestionType
    ordinal_number: int
    answers: list[QuizQuestionAnswerDto]


class QuizQuestionDtoSchema(Schema):
    id = fields.UUID(required=True)
    text = fields.String(required=True)
    type = fields.Enum(QuizQuestionType, required=True)
    ordinal_number = fields.Integer(required=True)
    answers = fields.Nested(QuizQuestionAnswerDtoSchema, many=True)
