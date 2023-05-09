from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID
from .quiz_question_answer_dto import QuizQuestionAnswerDtoSchema, QuizQuestionAnswerDto
from .quiz_quiestion_type import QuizQuestionType


@dataclass
class QuizQuestionDto:
    id: str
    text: str
    question_type: QuizQuestionType
    answers: list[QuizQuestionAnswerDto]


# noinspection PyTypeChecker
class QuizQuestionDtoSchema(Schema):
    id = ID(required=True)
    text = fields.String(required=True)
    question_type = fields.Enum(QuizQuestionType, required=True, data_key='questionType')
    answers = fields.Nested(QuizQuestionAnswerDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizQuestionDto:
        return QuizQuestionDto(**data)
