import uuid
from database import db, QuizTable, QuizQuestionTable, QuizAnswerVariantTable
from dtos import QuizQuestionEditDto, QuizQuestionAnswerEditDto, QuizQuestionDto, QuizQuestionPositionDto, \
    QuizQuestionType
from mappers import map_quiz_question_to_dto, map_question_type_to_db_question_type
from sqlalchemy import func


# noinspection PyMethodMayBeStatic
class QuizQuestionFacade:
    def create_question(self, owner_id: str, dto: QuizQuestionEditDto) -> QuizQuestionDto | None:
        quiz = QuizTable.query.filter_by(id=dto.quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return None
        question = QuizQuestionTable()
        question.id = str(uuid.uuid4())
        question.quiz_id = quiz.id
        question.text = dto.text
        question.type = map_question_type_to_db_question_type(dto.question_type)
        question.ordinal_number = self._get_next_question_ordinal_number(quiz.id)
        question.answers = [self._create_answer_variant(dto.question_type, a) for a in dto.answers]
        db.session.add(question)
        db.session.commit()
        return map_quiz_question_to_dto(question)

    def _get_next_question_ordinal_number(self, quiz_id: str | None) -> int:
        if quiz_id is None:
            return 0
        max_ord = db.session.query(func.max(QuizQuestionTable.ordinal_number)).filter_by(quiz_id=quiz_id).scalar()
        return 0 if max_ord is None else max_ord + 1

    def _create_answer_variant(self,
                               question_type: QuizQuestionType,
                               answer_dto: QuizQuestionAnswerEditDto
                               ) -> QuizAnswerVariantTable:
        answer = QuizAnswerVariantTable()
        answer.id = str(uuid.uuid4())
        answer.text = answer_dto.text
        answer.is_correct = True if question_type == QuizQuestionType.FREE_TEXT else answer_dto.is_correct
        return answer

    def edit_question(self, owner_id: str, dto: QuizQuestionEditDto) -> QuizQuestionDto | None:
        question = QuizQuestionTable.query \
            .filter_by(id=dto.id, quiz_id=dto.quiz_id) \
            .join(QuizQuestionTable.quiz) \
            .filter(QuizTable.owner_id == owner_id) \
            .first()
        if question is None:
            return None
        question.text = dto.text
        question.type = map_question_type_to_db_question_type(dto.question_type)
        self._apply_answers_changes(question, dto)
        db.session.commit()
        return map_quiz_question_to_dto(question)

    def _apply_answers_changes(self, question: QuizQuestionTable, dto: QuizQuestionEditDto):
        for q_answer in question.answers:
            an = next(filter(lambda a: a.id == q_answer.id, dto.answers), None)
            if an is None:
                db.session.delete(q_answer)
            else:
                q_answer.text = an.text
                q_answer.is_correct = an.is_correct
        for an in filter(lambda a: a.id is None, dto.answers):
            an_tbl = QuizAnswerVariantTable()
            an_tbl.id = uuid.uuid4()
            an_tbl.text = an.text
            an_tbl.is_correct = an.is_correct
            question.answers.append(an_tbl)

    def delete_question(self, owner_id: str, question_id: str) -> bool:
        question = QuizQuestionTable.query \
            .filter_by(id=question_id) \
            .join(QuizQuestionTable.quiz) \
            .filter(QuizTable.owner_id == owner_id) \
            .first()
        if question is None:
            return False
        db.session.delete(question)
        db.session.commit()
        return True

    def reorder_questions(self,
                          owner_id: str,
                          quiz_id: str,
                          questions_positions: list[QuizQuestionPositionDto]
                          ) -> list[QuizQuestionDto] | None:
        questions = QuizQuestionTable.query \
            .join(QuizQuestionTable.quiz) \
            .filter(QuizTable.owner_id == owner_id, QuizTable.id == quiz_id) \
            .all()
        if questions is None:
            return None
        for idx, qp in enumerate(sorted(questions_positions, key=lambda q: q.index)):
            question = next(filter(lambda q: q.id == qp.id, questions), None)
            if question is None:
                return None
            question.ordinal_number = idx
        db.session.commit()
        return [map_quiz_question_to_dto(q) for q in sorted(questions, key=lambda q: q.ordinal_number)]
