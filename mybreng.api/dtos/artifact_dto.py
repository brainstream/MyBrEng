from dataclasses import dataclass
from datetime import datetime

from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class ArtifactContentDto:
    content: bytes
    filename: str
    mime: str


@dataclass
class ArtifactDto:
    id: str
    filename: str
    mime: str
    upload_date: datetime


@dataclass
class ArtifactListDto:
    artifacts: list[ArtifactDto]
    start_index: int
    total_count: int


class ArtifactDtoSchema(Schema):
    id = ID(required=True)
    filename = fields.String(required=True)
    mime = fields.String(required=True)
    upload_date = fields.DateTime(required=True, data_key='uploadDate', format='rfc')

    @post_load
    def make_dto(self, data, **kwargs) -> ArtifactDto:
        return ArtifactDto(**data)


class ArtifactListDtoSchema(Schema):
    artifacts = fields.Nested(ArtifactDtoSchema, many=True)
    start_index = fields.Integer(required=True, data_key='startIndex')
    total_count = fields.Integer(required=True, data_key='totalCount')

    @post_load
    def make_dto(self, data, **kwargs) -> ArtifactListDto:
        return ArtifactListDto(**data)
