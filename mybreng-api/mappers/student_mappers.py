from database import StudentTable
from dtos import StudentDto


def map_student_to_dto(student: StudentTable) -> StudentDto:
    return StudentDto(
        student.id,
        student.first_name,
        student.last_name
    )
