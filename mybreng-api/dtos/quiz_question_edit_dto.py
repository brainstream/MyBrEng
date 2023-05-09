from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .quiz_quiestion_type import QuizQuestionType
from .id import ID


@dataclass
class QuizQuestionAnswerEditDto:
    id: str | None
    text: str
    is_correct: bool


class QuizQuestionAnswerEditDtoSchema(Schema):
    id = ID(required=False, load_default=None)
    text = fields.String(required=True)
    is_correct = fields.Boolean(data_key='isCorrect', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizQuestionAnswerEditDto:
        return QuizQuestionAnswerEditDto(**data)


@dataclass
class QuizQuestionEditDto:
    quiz_id: str
    id: str | None
    question_type: QuizQuestionType
    text: str
    answers: list[QuizQuestionAnswerEditDto]


# noinspection PyTypeChecker
class QuizQuestionEditDtoSchema(Schema):
    quiz_id = ID(required=True)
    id = ID(required=False, load_default=None)
    question_type = fields.Enum(QuizQuestionType, required=True, data_key='questionType')
    text = fields.String(required=True)
    answers = fields.Nested(QuizQuestionAnswerEditDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizQuestionEditDto:
        return QuizQuestionEditDto(**data)
