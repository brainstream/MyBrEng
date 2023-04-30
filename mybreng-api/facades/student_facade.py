from database import StudentTable
from dtos import StudentDto
from mappers import map_student_to_dto


# noinspection PyMethodMayBeStatic
class StudentFacade:
    def get_students(self, owner_id: str) -> list[StudentDto]:
        students = StudentTable.query.filter_by(owner_id=owner_id).all()
        return [map_student_to_dto(s) for s in students]
