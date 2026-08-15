from dataclasses import dataclass, field

from marshmallow import Schema, fields, post_load

from .id import ID
from .quiz_question_type import QuizQuestionType


@dataclass
class QuizQuestionAnswerEditDto:
    text: str
    is_correct: bool
    id: str | None = field(default=None)


class QuizQuestionAnswerEditDtoSchema(Schema):
    id = ID(required=False)
    text = fields.String(required=True)
    is_correct = fields.Boolean(data_key='isCorrect', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizQuestionAnswerEditDto:
        return QuizQuestionAnswerEditDto(**data)


@dataclass
class QuizQuestionEditDto:
    quiz_id: str
    question_type: QuizQuestionType
    text: str
    answers: list[QuizQuestionAnswerEditDto]
    id: str | None = field(default=None)
    word_answer: str | None = field(default=None)


# noinspection PyTypeChecker
class QuizQuestionEditDtoSchema(Schema):
    quiz_id = ID(required=True)
    id = ID(required=False)
    question_type = fields.Enum(QuizQuestionType, required=True, data_key='questionType')
    text = fields.String(required=True)
    answers = fields.Nested(QuizQuestionAnswerEditDtoSchema, many=True)
    word_answer = fields.String(required=False, allow_none=True, data_key='wordAnswer')

    @post_load
    def make_dto(self, data, **kwargs) -> QuizQuestionEditDto:
        return QuizQuestionEditDto(**data)
