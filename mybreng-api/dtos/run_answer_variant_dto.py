from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from dtos import ID


@dataclass
class RunAnswerVariantDto:
    answer_id: str
    text: str
    is_correct: bool | None


class RunAnswerVariantDtoSchema(Schema):
    answer_id = ID(required=True, data_key='answerId')
    text = fields.String(required=True)
    is_correct = fields.Boolean(required=False, data_key='isCorrect')

    @post_load
    def make_dto(self, data, **kwargs) -> RunAnswerVariantDto:
        return RunAnswerVariantDto(**data)
