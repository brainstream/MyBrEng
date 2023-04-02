from database import QuizTable
from dtos import QuizDto, QuizDetailedDto


# noinspection PyMethodMayBeStatic
class QuizFacade:
    def get_quizzes(self):
        return [self._map_to_quiz(quiz) for quiz in QuizTable.query.all()]

    def _map_to_quiz(self, quiz: QuizTable) -> QuizDto:
        return QuizDto(quiz.id, quiz.title, quiz.description)

    def get_quiz(self, quiz_id: str):
        quiz = QuizTable.query.filter_by(id=quiz_id).first()
        if quiz is None:
            return None
        return self._map_to_quiz_details(quiz)

    def _map_to_quiz_details(self, quiz: QuizTable) -> QuizDetailedDto:
        return QuizDetailedDto(quiz.id, quiz.title, quiz.description, [])
