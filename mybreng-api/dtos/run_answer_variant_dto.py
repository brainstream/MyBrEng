from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from dtos import ID


@dataclass
class RunAnswerVariantDto:
    question_answer_id: str
    text: str


class RunAnswerVariantDtoSchema(Schema):
    question_answer_id = ID(required=True, data_key='questionAnswerId')
    text = fields.String(required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> RunAnswerVariantDto:
        return RunAnswerVariantDto(**data)
