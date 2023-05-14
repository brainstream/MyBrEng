from dataclasses import field, dataclass
from marshmallow import Schema, fields, post_load

from dtos import ID


@dataclass
class RunAnswerDto:
    variant_id: str | None = field(default=None)
    text: str | None = field(default=None)


class RunAnswerDtoSchema(Schema):
    variant_id = ID(required=False, data_key='variantId')
    text = fields.String(required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> RunAnswerDto:
        return RunAnswerDto(**data)
