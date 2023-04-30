from database import StudentTable
from dtos import StudentDto, StudentDetailedDto
from .run_mappers import map_run_to_summary_dto


def map_student_to_dto(student: StudentTable) -> StudentDto:
    return StudentDto(
        student.id,
        student.first_name,
        student.last_name
    )


def map_student_to_detailed_dto(student: StudentTable) -> StudentDetailedDto:
    return StudentDetailedDto(
        student.id,
        student.first_name,
        student.last_name,
        student.note,
        [map_run_to_summary_dto(run) for run in student.runs]
    )
