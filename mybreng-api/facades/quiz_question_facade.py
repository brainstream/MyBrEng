import uuid

from database import db, QuizTable, QuizQuestionTable, QuizAnswerVariantTable
from dtos import QuizQuestionEditDto
from mappers import map_quiz_question_to_dto, map_question_type_to_db_question_type


# noinspection PyMethodMayBeStatic
class QuizQuestionFacade:
    def create_question(self, owner_id: str, dto: QuizQuestionEditDto):
        quiz = QuizTable.query.filter_by(id=dto.quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return None
        question = QuizQuestionTable()
        question.quiz_id = quiz.id
        question.text = dto.text
        question.type = map_question_type_to_db_question_type(dto.question_type)
        last_question = max(quiz.questions, key=lambda q: q.ordianl_number)
        question.ordinal_number = 0 if last_question is None else last_question.ordianl_number + 1
        question.answers = [QuizAnswerVariantTable(
            str(uuid.uuid4()),
            a.text,
            a.is_correct
        ) for a in dto.answers]
        db.session.add(question)
        db.session.commit()
        return map_quiz_question_to_dto(question)

    def edit_question(self, owner_id: str, dto: QuizQuestionEditDto):
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
        for an in filter(lambda a: a.id == '', dto.answers):
            an_tbl = QuizAnswerVariantTable()
            an_tbl.id = uuid.uuid4()
            an_tbl.text = an.text
            an_tbl.is_correct = an.is_correct
            question.answers.append(an_tbl)
