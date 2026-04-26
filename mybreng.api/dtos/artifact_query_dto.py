from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load


@dataclass
class ArtifactListQueryDto:
    take: int | None = field(default=False)
    skip: int | None = field(default=False)

class ArtifactListQueryDtoSchema(Schema):
    take = fields.Integer(required=False)
    skip = fields.Integer(required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> ArtifactListQueryDto:
        dto = ArtifactListQueryDto(**data)
        if dto.take < 1:
            dto.take = 50
        if dto.skip < 0:
            dto.skip = 0
        return dto
