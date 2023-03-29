from dataclasses import dataclass
from typing import Optional
from marshmallow import Schema, fields


@dataclass()
class QuizDto:
    id: str
    title: str
    description: Optional[str]


class QuizDtoSchema(Schema):
    id = fields.UUID()
    title = fields.Str()
    description = fields.Str(allow_none=True)
