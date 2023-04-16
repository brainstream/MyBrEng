from database import db, QuizTable
from dtos import QuizDto, QuizDetailedDto, QuizEditDto
from mappers import map_quiz_question_to_dto, map_quiz_to_detailed_dto


# noinspection PyMethodMayBeStatic
class QuizFacade:
    def get_quizzes(self, user_id: str):
        return [self._map_to_quiz(quiz) for quiz in QuizTable.query.filter_by(owner_id=user_id).all()]

    def get_quiz(self, quiz_id: str, owner_id: str):
        quiz = QuizTable.query.filter_by(id=quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return None
        return map_quiz_to_detailed_dto(quiz)

    def edit_quiz(self, owner_id: str, dto: QuizEditDto) -> str | None:
        quiz = QuizTable.query.filter_by(id=dto.id, owner_id=owner_id).first()
        if quiz is None:
            return None
        quiz.title = dto.title
        quiz.description = dto.description
        db.session.commit()
        return quiz.id

    def create_quiz(self, owner_id: str, dto: QuizEditDto) -> str:
        quiz = QuizTable()
        quiz.title = dto.title
        quiz.description = dto.description
        quiz.owner_id = owner_id
        db.session.commit()
        return quiz.id

    def _map_to_quiz(self, quiz: QuizTable) -> QuizDto:
        return QuizDto(quiz.id, quiz.title, quiz.description)
