from dataclasses import dataclass
from marshmallow import Schema, fields, post_load
from dtos import ID


@dataclass
class StudentNoteEditDto:
    student_id: str
    note: str


class StudentNoteEditDtoSchema(Schema):
    student_id = ID(data_key='studentId', required=True)
    note = fields.String()

    @post_load
    def make_dto(self, data, **kwargs):
        return StudentNoteEditDto(**data)
