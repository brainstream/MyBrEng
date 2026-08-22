from database import QuizQuestionTable, RunTable
from dtos import (
    QuizQuestionType,
    RunAnswerVariantDto,
    RunQuestionDto,
    RunSummaryDto,
    RunWordAnswerDto,
)

from .quiz_mappers import map_db_question_type_to_question_type


def map_run_to_summary_dto(run: RunTable) -> RunSummaryDto:
    return RunSummaryDto(
        run.id,
        run.quiz_id,
        run.quiz.title,
        run.creation_date,
        run.start_date,
        run.finish_date
    )


def map_question_to_question_run_dto(question: QuizQuestionTable, for_report: bool) -> RunQuestionDto:
    question_type = map_db_question_type_to_question_type(question.type)
    answer_variants = None \
        if question_type == QuizQuestionType.FREE_TEXT and not for_report \
        else [RunAnswerVariantDto(a.id, a.text, a.is_correct if for_report else None) for a in question.answers]
    word_answer: RunWordAnswerDto | None = None
    if question_type == QuizQuestionType.WORD_FROM_LETTERS and question.word_answer is not None:
        word_answer = RunWordAnswerDto(len(question.word_answer.text))
        if for_report:
            word_answer.answer = question.word_answer.text
    return RunQuestionDto(
        question.id,
        question.text,
        question_type,
        answer_variants,
        word_answer,
    )
