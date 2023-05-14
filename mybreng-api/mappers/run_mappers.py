from database import RunTable, QuizQuestionTable
from dtos import RunSummaryDto, RunQuestionDto, RunAnswerVariantDto
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


def map_question_to_question_run_dto(question: QuizQuestionTable) -> RunQuestionDto:
    answer_variants = [RunAnswerVariantDto(a.id, a.text) for a in question.answers]
    return RunQuestionDto(
        question.id,
        question.text,
        map_db_question_type_to_question_type(question.type),
        answer_variants
    )
