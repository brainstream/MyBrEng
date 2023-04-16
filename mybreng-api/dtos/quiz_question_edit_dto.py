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
    id: str | None
    question_type: QuizQuestionType
    text: str
    answers: list[QuizQuestionAnswerEditDto]


class QuizQuestionAnswerEditDtoSchema(Schema):
    id = fields.UUID(required=False, )
    text = fields.String(required=True)
    is_correct = fields.Boolean(required=False)

    @post_load
    def make_answer(self, data, **kwargs):
        answer_id = str(data['id']) if 'id' in data else ''
        answer = QuizQuestionAnswerEditDto(answer_id, data['text'], data['is_correct'])
        return answer


class QuizQuestionEditDtoSchema(Schema):
    quiz_id = fields.UUID(required=True)
    id = fields.UUID(required=False, allow_none=True)
    question_type = fields.Enum(QuizQuestionType, required=True)
    text = fields.String(required=True)
    answers = fields.Nested(QuizQuestionAnswerEditDtoSchema, many=True)

    @post_load
    def make_question(self, data, **kwargs):
        question_id = str(data['id']) if 'id' in data else None
        question = QuizQuestionEditDto(
            str(data['quiz_id']),
            question_id,
            data['question_type'],
            data['text'],
            data['answers']
        )
        question.quiz_id = str(question.quiz_id)
        question.id = str(question.id)
        if question_id is None:
            question.id = None
        return question

