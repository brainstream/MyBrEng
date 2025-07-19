from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class TagEditDto:
    name: str
    id: str | None = field(default=None)

class TagEditDtoSchema(Schema):
    id = ID(required=False)
    name = fields.String(required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> TagEditDto:
        return TagEditDto(**data)
