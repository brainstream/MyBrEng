from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID
from .run_finish_question_dto import RunFinishQuestionDto, RunFinishQuestionDtoSchema


@dataclass
class RunFinishDto:
    id: str
    questions: list[RunFinishQuestionDto]


# noinspection PyTypeChecker
class RunFinishDtoSchema(Schema):
    id = ID()
    questions = fields.Nested(RunFinishQuestionDtoSchema, many=True, required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> RunFinishDto:
        return RunFinishDto(**data)
