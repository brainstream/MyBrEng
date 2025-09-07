import uuid
from datetime import datetime, timezone
from database import db, RunTable, StudentTable, QuizTable, QuizQuestionTable, RunAnswerTable
from dtos import RunSummaryDto, RunCreateDto, RunDto, RunFinishDto, QuizQuestionType, RunReportAnswerDto
from mappers import \
    map_run_to_summary_dto, \
    map_question_to_question_run_dto, \
    map_db_question_type_to_question_type


# noinspection PyMethodMayBeStatic
class RunFacade:
    def get_run(self, run_id, mark_as_started: bool) -> RunDto | None:
        run = RunTable.query.filter_by(id=run_id).first()
        if run is None:
            return None
        questions = QuizQuestionTable.query \
            .filter_by(quiz_id=run.quiz_id) \
            .order_by(QuizQuestionTable.ordinal_number) \
            .all()
        is_finished = run.finish_date is not None
        title, description = QuizTable.query \
            .filter_by(id=run.quiz_id) \
            .with_entities(QuizTable.title, QuizTable.description) \
            .first()
        if mark_as_started and run.start_date is None:
            run.start_date = datetime.now(timezone.utc)
            db.session.commit()
        return RunDto(
            run_id,
            title,
            '' if description is None else description,
            is_finished,
            [map_question_to_question_run_dto(q, is_finished) for q in questions],
            [RunReportAnswerDto(a.question_id, a.answer_variant_id, a.text) for a in run.answers]
        )

    def create_run(self, owner_id: str, dto: RunCreateDto) -> RunSummaryDto | None:
        student = StudentTable.query.filter_by(id=dto.student_id, owner_id=owner_id).first()
        quiz = QuizTable.query.filter_by(id=dto.quiz_id, owner_id=owner_id).first()
        if student is None or quiz is None:
            return None
        run = RunTable()
        run.id = uuid.uuid4()
        run.student_id = dto.student_id
        run.quiz_id = dto.quiz_id
        run.creation_date = datetime.now(timezone.utc)
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
            RunAnswerTable.query.filter_by(run_id=run_id).delete()
            RunTable.query.filter_by(id=run_id).delete()
            db.session.commit()
            return True
        return False

    def finish_run(self, dto: RunFinishDto) -> RunDto | None:
        run = RunTable.query.filter_by(id=dto.id).first()
        if run is None:
            return None
        run.finish_date = datetime.now(timezone.utc)
        questions = QuizQuestionTable.query.filter_by(quiz_id=run.quiz_id).all()

        def does_question_require_text_answer(qid):
            question = next(filter(lambda qn: qn.id == qid, questions), None)
            if question is None:
                return False
            question_type = map_db_question_type_to_question_type(question.type)
            return question_type == QuizQuestionType.FREE_TEXT or question_type == QuizQuestionType.MATCH

        for q in dto.questions:
            requires_text_answer = does_question_require_text_answer(q.id)
            for a in q.answers:
                answer = RunAnswerTable()
                answer.id = uuid.uuid4()
                answer.run_id = run.id
                answer.question_id = q.id
                if requires_text_answer:
                    answer.text = a
                else:
                    answer.answer_variant_id = a
                db.session.add(answer)

        db.session.commit()
        return self.get_run(run.id, False)
