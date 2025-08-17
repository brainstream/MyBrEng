from dataclasses import dataclass, field
from marshmallow import Schema, fields, post_load


@dataclass
class TagQueryDto:
    only_applicable_for_students: bool | None = field(default=False)
    only_applicable_for_quizzes: bool | None = field(default=False)

class TagQueryDtoSchema(Schema):
    only_applicable_for_students = fields.Boolean(data_key='onlyApplicableForStudents', required=False)
    only_applicable_for_quizzes = fields.Boolean(data_key='onlyApplicableForQuizzes', required=False)

    @post_load
    def make_dto(self, data, **kwargs) -> TagQueryDto:
        return TagQueryDto(**data)
