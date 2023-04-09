from marshmallow import Schema, fields
from dataclasses import dataclass


@dataclass()
class QuizEditDto:
    title: str
    description: str | None


class QuizEditDtoSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=False)
