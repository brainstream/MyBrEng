from enum import Enum
from dataclasses import dataclass
from marshmallow import Schema, fields


class QuizQuestionType(str, Enum):
    SINGLE_CHOICE: str = 'SINGLE_CHOICE'
    MULTIPLE_CHOICE: str = 'MULTIPLE_CHOICE'
    FREE_TEXT: str = 'FREE_TEXT'


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
