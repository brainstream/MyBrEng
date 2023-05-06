import uuid

from database import StudentTable, db
from dtos import StudentDto, StudentDetailedDto, StudentEditDto
from mappers import map_student_to_dto, map_student_to_detailed_dto


# noinspection PyMethodMayBeStatic
class StudentFacade:
    def get_students(self, owner_id: str) -> list[StudentDto]:
        students = StudentTable.query.filter_by(owner_id=owner_id).all()
        return [map_student_to_dto(s) for s in students]

    def get_student(self, owner_id: str, student_id: str) -> StudentDetailedDto | None:
        student = StudentTable.query.filter_by(id=student_id, owner_id=owner_id).first()
        return None if student is None else map_student_to_detailed_dto(student)

    def create_student(self, owner_id: str, dto: StudentEditDto) -> StudentDto:
        student = StudentTable()
        student.id = uuid.uuid4()
        student.first_name = dto.first_name
        student.last_name = dto.last_name
        student.owner_id = owner_id
        db.session.add(student)
        return map_student_to_dto(student)

    def edit_student(self, owner_id: str, dto: StudentEditDto) -> StudentDto | None:
        student = StudentTable.query.filter_by(id=dto.id, owner_id=owner_id).first()
        if student is None:
            return None
        student.first_name = dto.first_name
        student.last_name = dto.last_name
        db.session.commit()
        return map_student_to_dto(student)
