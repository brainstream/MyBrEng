from database import QuizTable, QuizQuestionTable, QuizAnswerVariantTable
from dtos import QuizDto, QuizDetailedDto, QuizQuestionDto, QuizQuestionType, QuizQuestionAnswerDto


# noinspection PyMethodMayBeStatic
class QuizFacade:
    def get_quizzes(self, user_id: str):
        return [self._map_to_quiz(quiz) for quiz in QuizTable.query.filter_by(owner_id=user_id).all()]

    def _map_to_quiz(self, quiz: QuizTable) -> QuizDto:
        return QuizDto(quiz.id, quiz.title, quiz.description)

    def get_quiz(self, quiz_id: str, owner_id: str):
        quiz = QuizTable.query.filter_by(id=quiz_id, owner_id=owner_id).first()
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
            question.ordinal_number,
            [self._map_to_question_answer(answer) for answer in question.answers]
        )

    def _map_to_question_type(self, db_type: int) -> QuizQuestionType:
        match db_type:
            case 1:
                return QuizQuestionType.MULTIPLE_CHOICE
            case 2:
                return QuizQuestionType.FREE_TEXT
            case _:
                return QuizQuestionType.SINGLE_CHOICE

    def _map_to_question_answer(self, answer: QuizAnswerVariantTable) -> QuizQuestionAnswerDto:
        return QuizQuestionAnswerDto(answer.id, answer.text, answer.is_correct)
