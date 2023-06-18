from dataclasses import dataclass
from marshmallow import fields, post_load
from .run_summary_dto import RunSummaryDto, RunSummaryDtoSchema
from .student_dto import StudentDto, StudentDtoSchema


@dataclass
class StudentDetailedDto(StudentDto):
    note: str
    runs: list[RunSummaryDto]


# noinspection PyTypeChecker
class StudentDetailedDtoSchema(StudentDtoSchema):
    note = fields.String()
    runs = fields.Nested(RunSummaryDtoSchema, many=True)

    @post_load
    def make_dto(self, data, **kwargs) -> StudentDetailedDto:
        return StudentDetailedDto(**data)
