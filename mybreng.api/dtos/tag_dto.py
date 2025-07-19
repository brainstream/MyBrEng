from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class TagDto:
    id: str
    name: str

class TagDtoSchema(Schema):
    id = ID(required=True)
    name = fields.String(required=True)

    @post_load
    def make_dto(self, data, **kwargs) -> TagDto:
        return TagDto(**data)
