from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID
from .run_answer_variant_dto import RunAnswerVariantDto, RunAnswerVariantDtoSchema
from .run_answer_dto import RunAnswerDto, RunAnswerDtoSchema
from .quiz_quiestion_type import QuizQuestionType


@dataclass
class RunQuestionDto:
    question_id: str
    text: str
    question_type: QuizQuestionType
    answer_variants: list[RunAnswerVariantDto]
    answer: RunAnswerDto | None


# noinspection PyTypeChecker
class RunQuestionDtoSchema(Schema):
    question_id = ID(required=True, data_key='questionId')
    text = fields.String(required=True)
    question_type = fields.Enum(QuizQuestionType, required=True, data_key='questionType')
    answer_variants = fields.Nested(RunAnswerVariantDtoSchema, many=True, data_key='answerVariants')
    answer = fields.Nested(RunAnswerDtoSchema, required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> RunQuestionDto:
        return RunQuestionDto(**data)
