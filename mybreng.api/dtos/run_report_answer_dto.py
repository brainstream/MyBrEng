from dataclasses import dataclass, field
from marshmallow import fields, Schema, post_load

from .id import ID


@dataclass
class RunReportAnswerDto:
    question_id: str
    variant_id: str | None = field(default=None)
    text: str | None = field(default=None)


class RunReportAnswerDtoSchema(Schema):
    question_id = ID(required=False, data_key='questionId')
    variant_id = ID(required=False, data_key='variantId')
    text = fields.String(required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> RunReportAnswerDto:
        return RunReportAnswerDto(**data)
