from dataclasses import dataclass
from marshmallow import Schema, fields
from .quiz_question_answer_dto import QuizQuestionAnswerDtoSchema, QuizQuestionAnswerDto
from .quiz_quiestion_type import QuizQuestionType


@dataclass()
class QuizQuestionDto:
    id: str
    text: str
    question_type: QuizQuestionType
    answers: list[QuizQuestionAnswerDto]


class QuizQuestionDtoSchema(Schema):
    id = fields.UUID(required=True)
    text = fields.String(required=True)
    question_type = fields.Enum(QuizQuestionType, required=True)
    answers = fields.Nested(QuizQuestionAnswerDtoSchema, many=True)
