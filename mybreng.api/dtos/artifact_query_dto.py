from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load


@dataclass
class ArtifactListQueryDto:
    page_size: int | None = field(default=False)
    page_index: int | None = field(default=False)

class ArtifactListQueryDtoSchema(Schema):
    page_size = fields.Integer(data_key='pageSize', required=False)
    page_index = fields.Integer(data_key='pageIndex', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> ArtifactListQueryDto:
        dto = ArtifactListQueryDto(**data)
        if dto.page_size < 1:
            dto.page_size = 50
        if dto.page_index < 0:
            dto.page_size = 0
        return dto
