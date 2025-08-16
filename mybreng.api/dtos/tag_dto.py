from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class TagDto:
    id: str
    name: str
    color: int | None = field(default=None)
    is_applicable_for_students: bool | None = field(default=False)
    is_applicable_for_quizzes: bool | None = field(default=False)

class TagDtoSchema(Schema):
    id = ID(required=True)
    name = fields.String(required=True)
    color = fields.Integer(required=False)
    is_applicable_for_students = fields.Boolean(data_key='isApplicableForStudents', required=False)
    is_applicable_for_quizzes = fields.Boolean(data_key='isApplicableForQuizzes', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> TagDto:
        return TagDto(**data)
