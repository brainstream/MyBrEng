import uuid

from sqlalchemy.sql.operators import contains

from database import StudentTable, db, RunTable, TagTable, StudentTagTable
from dtos import StudentDto, StudentDetailedDto, StudentEditDto, StudentNoteEditDto
from mappers import map_student_to_dto, map_student_to_detailed_dto


# noinspection PyMethodMayBeStatic
class StudentFacade:
    def get_students(self, owner_id: str) -> list[StudentDto]:
        students = StudentTable.query \
            .where(StudentTable.owner_id == owner_id) \
            .all()
        return [map_student_to_dto(s) for s in students]

    def get_student(self, owner_id: str, student_id: str) -> StudentDetailedDto | None:
        student = StudentTable.query \
            .where(StudentTable.id == student_id, StudentTable.owner_id == owner_id) \
            .first()
        return None if student is None else map_student_to_detailed_dto(student)

    def create_student(self, owner_id: str, dto: StudentEditDto) -> StudentDto:
        student = StudentTable()
        student.id = uuid.uuid4()
        student.first_name = dto.first_name
        student.last_name = dto.last_name
        student.owner_id = owner_id
        if dto.tags is not None and len(dto.tags) > 0:
            tags = self.__get_tags(owner_id, dto.tags)
            for tag in tags:
                rel = StudentTagTable()
                rel.student_id = student.id
                rel.tag_id = tag.id
                student.tags.append(rel)
                db.session.add(rel)
        db.session.add(student)
        db.session.commit()
        return map_student_to_dto(student)

    def __get_tags(self, owner_id: str, ids: list[str]):
        return TagTable.query \
            .where(
                TagTable.owner_id == owner_id,
                TagTable.is_applicable_for_students,
                TagTable.id.in_(ids)
            ) \
            .all()

    def edit_student(self, owner_id: str, dto: StudentEditDto) -> StudentDto | None:
        student = StudentTable.query \
            .where(StudentTable.id == dto.id, StudentTable.owner_id == owner_id) \
            .first()
        if student is None:
            return None
        tag_ids = [] if dto.tags is None else [t.id for t in self.__get_tags(owner_id, dto.tags)]
        for tag in student.tags:
            if not tag.tag_id in tag_ids:
                db.session.delete(tag)
        for tag_id in tag_ids:
            if not any(t.tag_id == tag_id for t in student.tags):
                rel = StudentTagTable()
                rel.student_id = student.id
                rel.tag_id = tag_id
                student.tags.append(rel)
                db.session.add(rel)
        student.first_name = dto.first_name
        student.last_name = dto.last_name
        db.session.commit()
        return map_student_to_dto(student)

    def delete_student(self, owner_id: str, student_id: str) -> bool:
        student = StudentTable.query \
            .where(StudentTable.id == student_id, StudentTable.owner_id == owner_id) \
            .first()
        if student is None:
            return False
        StudentTagTable.query.where(StudentTagTable.student_id == student_id).delete()
        RunTable.query.filter_by(student_id=student.id).delete()
        db.session.delete(student)
        db.session.commit()
        return True

    def set_student_note(self, owner_id: str, dto: StudentNoteEditDto) -> bool:
        student = StudentTable.query \
            .where(StudentTable.id == dto.student_id, StudentTable.owner_id == owner_id) \
            .first()
        if student is None:
            return False
        student.note = dto.note
        db.session.commit()
        return True
