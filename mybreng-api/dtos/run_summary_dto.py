from dataclasses import dataclass
from datetime import datetime
from marshmallow import Schema, fields


@dataclass()
class RunSummaryDto:
    id: str
    quiz_id: str
    quiz_title: str
    creation_date: datetime
    start_date: datetime | None
    finish_date: datetime | None


class RunSummaryDtoSchema(Schema):
    id = fields.UUID(required=True)
    quiz_id = fields.UUID(required=True, data_key='quizId')
    quiz_title = fields.String(required=True, data_key='quizTitle')
    creation_date = fields.DateTime(required=True, data_key='creationDate', format='rfc')
    start_date = fields.DateTime(allow_none=True, data_key='startDate', format='rfc')
    finish_date = fields.DateTime(allow_none=True, data_key='finishDate', format='rfc')
