from dataclasses import dataclass
from datetime import datetime
from marshmallow import Schema, fields


@dataclass()
class RunSummaryDto:
    id: str
    quiz_id: str
    creation_date: datetime
    start_date: datetime | None
    finish_date: datetime | None


class RunSummaryDtoSchema(Schema):
    id = fields.UUID(required=True)
    quiz_id = fields.UUID(required=True, data_key='quizId')
    creation_date = fields.DateTime(required=True, data_key='creationDate')
    start_date = fields.DateTime(allow_none=True, data_key='startDate')
    finish_date = fields.DateTime(allow_none=True, data_key='finishDate')
