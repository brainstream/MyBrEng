from marshmallow import Schema, fields
from dataclasses import dataclass


@dataclass()
class QuizEditDto:
    id: str | None
    title: str
    description: str | None


class QuizEditDtoSchema(Schema):
    id = fields.UUID(required=False)
    title = fields.String(required=True)
    description = fields.String(required=False)
