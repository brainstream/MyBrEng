from enum import Enum
from dataclasses import dataclass
from marshmallow import Schema, fields


class QuizQuestionType(int, Enum):
    SINGLE_CHOICE: int = 0
    MULTIPLE_CHOICE: int = 1
    FREE_TEXT: int = 2


@dataclass()
class QuizQuestionDto:
    id: str
    text: str
    type: QuizQuestionType
    ordinal_number: int


class QuizQuestionDtoSchema(Schema):
    id = fields.UUID(required=True)
    text = fields.String(required=True)
    type = fields.Enum(QuizQuestionType, required=True)
    ordinal_number = fields.Integer(required=True)
