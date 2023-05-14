import uuid
from datetime import datetime
from database import db, RunTable, StudentTable, QuizTable, QuizQuestionTable
from dtos import RunSummaryDto, RunCreateDto, RunDto
from mappers import map_run_to_summary_dto, map_question_to_question_run_dto


# noinspection PyMethodMayBeStatic
class RunFacade:
    def get_run(self, run_id) -> RunDto | None:
        run = RunTable.query.filter_by(id=run_id).first()
        if run is None:
            return None
        questions = QuizQuestionTable.query.filter_by(quiz_id=run.quiz_id).all()
        return RunDto(run_id, [map_question_to_question_run_dto(q) for q in questions])

    def create_run(self, owner_id: str, dto: RunCreateDto) -> RunSummaryDto | None:
        student = StudentTable.query.filter_by(id=dto.student_id, owner_id=owner_id).first()
        quiz = QuizTable.query.filter_by(id=dto.quiz_id, owner_id=owner_id).first()
        if student is None or quiz is None:
            return None
        run = RunTable()
        run.id = uuid.uuid4()
        run.student_id = dto.student_id
        run.quiz_id = dto.quiz_id
        run.creation_date = datetime.utcnow()
        db.session.add(run)
        db.session.commit()
        return map_run_to_summary_dto(run)

    def delete_run(self, owner_id: str, run_id: str) -> bool:
        query = RunTable.query \
            .filter_by(id=run_id) \
            .join(StudentTable, StudentTable.id == RunTable.student_id) \
            .filter(StudentTable.owner_id == owner_id) \
            .exists()
        if db.session.query(query).scalar():
            RunTable.query.filter_by(id=run_id).delete()
            db.session.commit()
            return True
        return False

