from database import QuizTable, QuizQuestionTable, QuizAnswerVariantTable
from dtos import QuizDto, QuizDetailedDto, QuizQuestionDto, QuizQuestionType, QuizQuestionAnswerDto
from .tag_mappers import map_tag_to_dto


def map_quiz_to_dto(quiz: QuizTable) -> QuizDto:
    return QuizDto(
        quiz.id,
        quiz.title,
        quiz.description,
        [map_tag_to_dto(tag.tag) for tag in quiz.tags]
    )


def map_quiz_to_detailed_dto(quiz: QuizTable) -> QuizDetailedDto:
    return QuizDetailedDto(
        quiz.id,
        quiz.title,
        quiz.description,
        [map_tag_to_dto(tag.tag) for tag in quiz.tags],
        [map_quiz_question_to_dto(question) for question in quiz.questions]
    )


def map_quiz_question_to_dto(question: QuizQuestionTable) -> QuizQuestionDto:
    return QuizQuestionDto(
        question.id,
        question.text,
        map_db_question_type_to_question_type(question.type),
        [map_answer_variant_to_dto(answer) for answer in question.answers]
    )


def map_db_question_type_to_question_type(db_type: int) -> QuizQuestionType:
    match db_type:
        case 1:
            return QuizQuestionType.MULTIPLE_CHOICE
        case 2:
            return QuizQuestionType.FREE_TEXT
        case _:
            return QuizQuestionType.SINGLE_CHOICE


def map_question_type_to_db_question_type(q_type: QuizQuestionType) -> int:
    match q_type:
        case QuizQuestionType.MULTIPLE_CHOICE:
            return 1
        case QuizQuestionType.FREE_TEXT:
            return 2
        case _:
            return 0


def map_answer_variant_to_dto(answer: QuizAnswerVariantTable) -> QuizQuestionAnswerDto:
    return QuizQuestionAnswerDto(answer.id, answer.text, answer.is_correct)
