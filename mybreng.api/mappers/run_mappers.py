import random

from database import QuizQuestionTable, RunTable
from dtos import (
    QuizQuestionType,
    RunAnswerVariantDto,
    RunMatchDto,
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
        run.finish_date,
    )


def map_question_to_question_run_dto(
    question: QuizQuestionTable, for_report: bool
) -> RunQuestionDto:
    question_type = map_db_question_type_to_question_type(question.type)
    return RunQuestionDto(
        question.id,
        question.text,
        question_type,
        _map_answer_variants(question_type, question, for_report),
        _map_word_answer(question_type, question, for_report),
        _map_match_answer(question_type, question),
    )


def _map_answer_variants(
    question_type: QuizQuestionType, question: QuizQuestionTable, for_report: bool
) -> list[RunAnswerVariantDto] | None:
    if not _need_to_include_answer_variants(question_type, for_report):
        return None
    result: list[RunAnswerVariantDto] = []
    for a in question.answers:
        slot_text = a.slot.text if (for_report and a.slot is not None) else None
        result.append(
            RunAnswerVariantDto(
                a.id,
                a.text,
                a.is_correct if for_report else None,
                slot_text,
            )
        )
    random.shuffle(result)
    return result


def _need_to_include_answer_variants(
    question_type: QuizQuestionType, for_report: bool
) -> bool:
    return question_type != QuizQuestionType.FREE_TEXT or for_report


def _map_word_answer(
    question_type: QuizQuestionType, question: QuizQuestionTable, for_report: bool
) -> RunWordAnswerDto | None:
    word_answer: RunWordAnswerDto | None = None
    if (
        question_type == QuizQuestionType.WORD_FROM_LETTERS
        and question.word_answer is not None
    ):
        word_answer = RunWordAnswerDto(len(question.word_answer.text))
        if for_report:
            word_answer.answer = question.word_answer.text
    return word_answer


def _map_match_answer(
    question_type: QuizQuestionType, question: QuizQuestionTable
) -> RunMatchDto | None:
    if question_type != QuizQuestionType.MATCH:
        return None
    slots = [
        a.slot.text for a in question.answers if a.slot is not None and a.slot.text
    ]
    random.shuffle(slots)
    return RunMatchDto(slots)
