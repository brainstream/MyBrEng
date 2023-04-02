from database import QuizTable, QuizQuestionTable
from dtos import QuizDto, QuizDetailedDto, QuizQuestionDto, QuizQuestionType


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
        return QuizDetailedDto(
            quiz.id,
            quiz.title,
            quiz.description,
            [self._map_to_quiz_question(question) for question in quiz.questions]
        )

    def _map_to_quiz_question(self, question: QuizQuestionTable) -> QuizQuestionDto:
        return QuizQuestionDto(
            question.id,
            question.text,
            self._map_to_question_type(question.type),
            question.ordinal_number
        )

    def _map_to_question_type(self, db_type: int) -> QuizQuestionType:
        match db_type:
            case 1:
                return QuizQuestionType.MULTIPLE_CHOICE
            case 2:
                return QuizQuestionType.FREE_TEXT
            case _:
                return QuizQuestionType.SINGLE_CHOICE
