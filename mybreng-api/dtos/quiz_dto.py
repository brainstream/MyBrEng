from dataclasses import dataclass
from typing import Optional
from marshmallow import Schema, fields


@dataclass()
class QuizDto:
    id: str
    title: str
    description: Optional[str]


class QuizDtoSchema(Schema):
    id = fields.UUID(required=True)
    title = fields.String(required=True)
    description = fields.String(allow_none=True)
