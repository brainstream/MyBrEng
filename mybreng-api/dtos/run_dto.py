from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID
from .run_question_dto import RunQuestionDto, RunQuestionDtoSchema


@dataclass
class RunDto:
    id: str
    is_finished: bool
    questions: list[RunQuestionDto]


# noinspection PyTypeChecker
class RunDtoSchema(Schema):
    id = ID()
    is_finished = fields.Boolean(required=True, data_key='isFinished')
    questions = fields.Nested(RunQuestionDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs):
        return RunDto(**data)
