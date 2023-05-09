from dataclasses import dataclass
from marshmallow import fields, post_load
from .quiz_dto import QuizDto, QuizDtoSchema
from .quiz_quiestion_dto import QuizQuestionDto, QuizQuestionDtoSchema


@dataclass
class QuizDetailedDto(QuizDto):
    questions: list[QuizQuestionDto]


# noinspection PyTypeChecker
class QuizDetailedDtoSchema(QuizDtoSchema):
    questions = fields.Nested(QuizQuestionDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs) -> QuizDetailedDto:
        return QuizDetailedDto(**data)
