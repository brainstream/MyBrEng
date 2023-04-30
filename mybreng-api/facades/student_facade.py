from database import StudentTable
from dtos import StudentDto, StudentDetailedDto
from mappers import map_student_to_dto, map_student_to_detailed_dto


# noinspection PyMethodMayBeStatic
class StudentFacade:
    def get_students(self, owner_id: str) -> list[StudentDto]:
        students = StudentTable.query.filter_by(owner_id=owner_id).all()
        return [map_student_to_dto(s) for s in students]

    def get_student(self, owner_id: str, student_id: str) -> StudentDetailedDto | None:
        student = StudentTable.query.filter_by(id=student_id, owner_id=owner_id).first()
        return None if student is None else map_student_to_detailed_dto(student)
