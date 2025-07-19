from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class RunFinishQuestionDto:
    id: str
    answers: list[str]


# noinspection PyTypeChecker
class RunFinishQuestionDtoSchema(Schema):
    id = ID(required=True)
    answers = fields.List(fields.String, required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> RunFinishQuestionDto:
        return RunFinishQuestionDto(**data)
