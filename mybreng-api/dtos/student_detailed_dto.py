from dataclasses import dataclass
from marshmallow import fields
from .run_summary_dto import RunSummaryDto, RunSummaryDtoSchema
from .student_dto import StudentDto, StudentDtoSchema


@dataclass()
class StudentDetailedDto(StudentDto):
    note: str
    runs: list[RunSummaryDto]


class StudentDetailedDtoSchema(StudentDtoSchema):
    note = fields.String()
    runs = fields.Nested(RunSummaryDtoSchema, many=True)
