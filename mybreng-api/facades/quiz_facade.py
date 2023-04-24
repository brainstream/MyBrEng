import uuid

from database import db, QuizTable
from dtos import QuizDto,  QuizEditDto
from mappers import map_quiz_to_detailed_dto, map_quiz_to_dto


# noinspection PyMethodMayBeStatic
class QuizFacade:
    def get_quizzes(self, user_id: str):
        return [self._map_to_quiz(quiz) for quiz in QuizTable.query.filter_by(owner_id=user_id).all()]

    def get_quiz(self, quiz_id: str, owner_id: str):
        quiz = QuizTable.query.filter_by(id=quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return None
        return map_quiz_to_detailed_dto(quiz)

    def edit_quiz(self, owner_id: str, dto: QuizEditDto) -> QuizDto | None:
        quiz = QuizTable.query.filter_by(id=dto.id, owner_id=owner_id).first()
        if quiz is None:
            return None
        quiz.title = dto.title
        quiz.description = dto.description
        db.session.commit()
        return map_quiz_to_dto(quiz)

    def create_quiz(self, owner_id: str, dto: QuizEditDto) -> QuizDto:
        quiz = QuizTable()
        quiz.id = str(uuid.uuid4())
        quiz.title = dto.title
        quiz.description = dto.description
        quiz.owner_id = owner_id
        db.session.add(quiz)
        db.session.commit()
        return map_quiz_to_dto(quiz)

    def _map_to_quiz(self, quiz: QuizTable) -> QuizDto:
        return QuizDto(quiz.id, quiz.title, quiz.description)
