from dataclasses import dataclass

from marshmallow import Schema, fields, post_load
from .quiz_quiestion_type import QuizQuestionType


@dataclass()
class QuizQuestionAnswerEditDto:
    id: str
    text: str
    is_correct: bool


@dataclass()
class QuizQuestionEditDto:
    quiz_id: str
    id: str
    question_type: QuizQuestionType
    text: str
    answers: list[QuizQuestionAnswerEditDto]


class QuizQuestionAnswerEditDtoSchema(Schema):
    id = fields.UUID(required=False, )
    text = fields.String(required=True)
    is_correct = fields.Boolean(required=False)

    @post_load
    def make_answer(self, data, **kwargs):
        answer = QuizQuestionAnswerEditDto(**data)
        answer.id = str(answer.id)
        return answer


class QuizQuestionEditDtoSchema(Schema):
    quiz_id = fields.UUID(required=True)
    id = fields.UUID(required=False)
    question_type = fields.Enum(QuizQuestionType, required=True)
    text = fields.String(required=True)
    answers = fields.Nested(QuizQuestionAnswerEditDtoSchema, many=True)

    @post_load
    def make_question(self, data, **kwargs):
        question = QuizQuestionEditDto(**data)
        question.quiz_id = str(question.quiz_id)
        question.id = str(question.id)
        return question

