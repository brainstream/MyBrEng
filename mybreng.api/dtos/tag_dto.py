from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class TagDto:
    id: str
    name: str
    color: int | None = field(default=None)

class TagDtoSchema(Schema):
    id = ID(required=True)
    name = fields.String(required=True)
    color = fields.Integer(required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> TagDto:
        return TagDto(**data)
