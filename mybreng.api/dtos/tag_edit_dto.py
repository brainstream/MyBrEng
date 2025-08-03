from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load
from .id import ID


@dataclass
class TagEditDto:
    name: str
    id: str | None = field(default=None)
    color: int | None = field(default=None)
    is_applicable_for_students: bool | None = field(default=False)
    is_applicable_for_quizzes: bool | None = field(default=False)

class TagEditDtoSchema(Schema):
    id = ID(required=False)
    name = fields.String(required=True)
    color = fields.Integer(required=False)
    is_applicable_for_students = fields.Boolean(data_key='isApplicableForStudents', required=False)
    is_applicable_for_quizzes = fields.Boolean(data_key='isApplicableForQuizzes', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> TagEditDto:
        return TagEditDto(**data)
