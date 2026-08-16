from enum import Enum

from database import (
    QuizAnswerVariantTable,
    QuizQuestionTable,
    QuizTable,
)
from dtos import (
    QuizDetailedDto,
    QuizDto,
    QuizQuestionAnswerDto,
    QuizQuestionDto,
    QuizQuestionType,
)

from .tag_mappers import map_tag_to_dto


class _QuizQuestionDatabaseType(int, Enum):
    SINGLE_CHOICE = 0
    MULTIPLE_CHOICE = 1
    FREE_TEXT = 2
    MATCH = 3
    WORD_FROM_LETTERS = 4


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
    word_answer = None if question.word_answer is None else question.word_answer.text
    return QuizQuestionDto(
        question.id,
        question.text,
        map_db_question_type_to_question_type(question.type),
        [map_answer_variant_to_dto(answer) for answer in question.answers],
        word_answer,
    )


def map_db_question_type_to_question_type(db_type: int) -> QuizQuestionType:
    match db_type:
        case _QuizQuestionDatabaseType.MULTIPLE_CHOICE.value:
            return QuizQuestionType.MULTIPLE_CHOICE
        case _QuizQuestionDatabaseType.FREE_TEXT.value:
            return QuizQuestionType.FREE_TEXT
        case _QuizQuestionDatabaseType.MATCH.value:
            return QuizQuestionType.MATCH
        case _QuizQuestionDatabaseType.WORD_FROM_LETTERS.value:
            return QuizQuestionType.WORD_FROM_LETTERS
        case _:
            return QuizQuestionType.SINGLE_CHOICE


def map_question_type_to_db_question_type(q_type: QuizQuestionType) -> int:
    match q_type:
        case QuizQuestionType.MULTIPLE_CHOICE:
            return _QuizQuestionDatabaseType.MULTIPLE_CHOICE.value
        case QuizQuestionType.FREE_TEXT:
            return _QuizQuestionDatabaseType.FREE_TEXT.value
        case QuizQuestionType.MATCH:
            return _QuizQuestionDatabaseType.MATCH.value
        case QuizQuestionType.WORD_FROM_LETTERS:
            return _QuizQuestionDatabaseType.WORD_FROM_LETTERS.value
        case _:
            return _QuizQuestionDatabaseType.SINGLE_CHOICE.value


def map_answer_variant_to_dto(answer: QuizAnswerVariantTable) -> QuizQuestionAnswerDto:
    return QuizQuestionAnswerDto(answer.id, answer.text, answer.is_correct)
