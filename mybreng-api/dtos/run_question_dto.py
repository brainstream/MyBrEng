from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID
from .run_answer_variant_dto import RunAnswerVariantDto, RunAnswerVariantDtoSchema
from .quiz_quiestion_type import QuizQuestionType


@dataclass
class RunQuestionDto:
    question_id: str
    text: str
    question_type: QuizQuestionType
    answer_variants: list[RunAnswerVariantDto] | None


# noinspection PyTypeChecker
class RunQuestionDtoSchema(Schema):
    question_id = ID(required=True, data_key='questionId')
    text = fields.String(required=True)
    question_type = fields.Enum(QuizQuestionType, required=True, data_key='questionType')
    answer_variants = fields.Nested(RunAnswerVariantDtoSchema, many=True, required=False, data_key='answerVariants')

    @post_load
    def make_dto(self, data, **kwargs) -> RunQuestionDto:
        return RunQuestionDto(**data)
