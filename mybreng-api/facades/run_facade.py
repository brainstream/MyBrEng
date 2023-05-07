import uuid

from datetime import datetime
from database import db, RunTable, StudentTable, QuizTable
from dtos import RunSummaryDto, RunCreateDto
from mappers import map_run_to_summary_dto


# noinspection PyMethodMayBeStatic
class RunFacade:
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
