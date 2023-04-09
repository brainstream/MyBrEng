from dataclasses import dataclass
from marshmallow import Schema, fields


@dataclass
class QuizQuestionCreateDto:
    title: str
    description: str


class QuizQuestionCreateDtoSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=False)
