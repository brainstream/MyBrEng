from dataclasses import dataclass
from marshmallow import fields
from .quiz_dto import QuizDto, QuizDtoSchema
from .quiz_quiestion_dto import QuizQuestionDto, QuizQuestionDtoSchema


@dataclass()
class QuizDetailedDto(QuizDto):
    questions: list[QuizQuestionDto]


class QuizDetailedDtoSchema(QuizDtoSchema):
    questions = fields.Nested(QuizQuestionDtoSchema, many=True)
