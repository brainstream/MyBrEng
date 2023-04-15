from database import \
    db, \
    QuizTable, \
    QuizQuestionTable, \
    QuizAnswerVariantTable
from dtos import \
    QuizDto, \
    QuizDetailedDto, \
    QuizQuestionDto, \
    QuizQuestionAnswerDto, \
    QuizEditDto, \
    QuizQuestionEditDto
from dtos.quiz_quiestion_type import QuizQuestionType


# noinspection PyMethodMayBeStatic
class QuizFacade:
    def get_quizzes(self, user_id: str):
        return [self._map_to_quiz(quiz) for quiz in QuizTable.query.filter_by(owner_id=user_id).all()]

    def get_quiz(self, quiz_id: str, owner_id: str):
        quiz = QuizTable.query.filter_by(id=quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return None
        return self._map_to_quiz_details(quiz)

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

    def create_question(self, owner_id: str, dto: QuizQuestionEditDto):
        quiz = QuizTable.query.filter_by(id=dto.quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return None
        question = QuizQuestionTable()
        question.quiz_id = quiz.id
        question.text = dto.text
        question.type = self._map_from_question_type(dto.question_type)
        last_question = max(quiz.questions, key=lambda q: q.ordianl_number)
        question.ordinal_number = 0 if last_question is None else last_question.ordianl_number + 1
        db.session.add(question)
        db.session.commit()
        return self._map_to_quiz_question(question)

    def edit_question(self, owner_id: str, dto: QuizQuestionEditDto):
        question = QuizQuestionTable.query \
            .filter_by(id=dto.id, quiz_id=dto.quiz_id) \
            .join(QuizQuestionTable.quiz) \
            .filter(QuizTable.owner_id == owner_id) \
            .first()
        if question is None:
            return None
        question.text = dto.text
        question.type = self._map_from_question_type(dto.question_type)
        db.session.commit()
        return self._map_to_quiz_question(question)

    def _map_to_quiz(self, quiz: QuizTable) -> QuizDto:
        return QuizDto(quiz.id, quiz.title, quiz.description)

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

    def _map_from_question_type(self, q_type: QuizQuestionType) -> int:
        match q_type:
            case QuizQuestionType.MULTIPLE_CHOICE:
                return 1
            case QuizQuestionType.FREE_TEXT:
                return 2
            case _:
                return 0

    def _map_to_question_answer(self, answer: QuizAnswerVariantTable) -> QuizQuestionAnswerDto:
        return QuizQuestionAnswerDto(answer.id, answer.text, answer.is_correct)

