from dataclasses import dataclass, field

from marshmallow import Schema, fields, post_load

from .id import ID
from .quiz_question_type import QuizQuestionType
from .run_answer_variant_dto import RunAnswerVariantDto, RunAnswerVariantDtoSchema


@dataclass
class RunWordAnswerDto:
    slots: int
    answer: str | None = field(default=None)


@dataclass
class RunMatchDto:
    slots: list[str]


@dataclass
class RunQuestionDto:
    question_id: str
    text: str
    question_type: QuizQuestionType
    answer_variants: list[RunAnswerVariantDto] | None
    word_answer: RunWordAnswerDto | None = field(default=None)
    match_answer: RunMatchDto | None = field(default=None)


# noinspection PyTypeChecker
class RunWordAnswerDtoSchema(Schema):
    slots = fields.Integer(required=True)
    answer = fields.String(required=False, allow_none=True)


# noinspection PyTypeChecker
class RunMatchDtoSchema(Schema):
    slots = fields.List(fields.String(), required=True)


# noinspection PyTypeChecker
class RunQuestionDtoSchema(Schema):
    question_id = ID(required=True, data_key='questionId')
    text = fields.String(required=True)
    question_type = fields.Enum(QuizQuestionType, required=True, data_key='questionType')
    answer_variants = fields.Nested(RunAnswerVariantDtoSchema, many=True, required=False, data_key='answerVariants')
    word_answer = fields.Nested(RunWordAnswerDtoSchema, required=False, data_key='wordAnswer')
    match_answer = fields.Nested(RunMatchDtoSchema, required=False, data_key='matchAnswer')

    @post_load
    def make_dto(self, data, **kwargs) -> RunQuestionDto:
        return RunQuestionDto(**data)
