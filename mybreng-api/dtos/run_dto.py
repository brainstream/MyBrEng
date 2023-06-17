from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load
from .id import ID
from .run_question_dto import RunQuestionDto, RunQuestionDtoSchema
from .run_report_answer_dto import RunReportAnswerDto, RunReportAnswerDtoSchema


@dataclass
class RunDto:
    id: str
    title: str
    description: str
    is_finished: bool
    questions: list[RunQuestionDto]
    report: list[RunReportAnswerDto] = field(default_factory=lambda: [])


# noinspection PyTypeChecker
class RunDtoSchema(Schema):
    id = ID()
    title = fields.String(required=True)
    description = fields.String(required=True)
    is_finished = fields.Boolean(required=True, data_key='isFinished')
    questions = fields.Nested(RunQuestionDtoSchema, many=True)
    report = fields.Nested(RunReportAnswerDtoSchema, many=True, required=False)

    @post_load
    def make_dto(self, data, **kwargs):
        return RunDto(**data)
