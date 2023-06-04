import { RunAnswerDto, RunAnswerVariantDto, RunDto, RunQuestionDto } from "@app/web-api";

export interface IQuizRepor {
    readonly items: IQuizReportItem[];
    readonly summary: IQuizReporSummary;
}

export interface IQuizReporSummary {
    totalQuestionCount: number;
    passedQuestionCount: number;
}

export interface IQuizReportItem {
    readonly question: string;
    readonly questionType: RunQuestionDto.QuestionTypeEnum;
    readonly answers: IQuizReporAnswer[];
    readonly isPassed: boolean;
}

export interface IQuizReporAnswer {
    readonly text: string;
    readonly isCorrect: boolean;
    readonly isAnswerMatched: boolean;
}

export function mapRunToReport(run: RunDto): IQuizRepor {
    const items = mapRunQuestionsToReportItems(run);
    const summary = items.reduce((sum, item) => {
        ++sum.totalQuestionCount;
        if (item.isPassed) {
            ++sum.passedQuestionCount;
        }
        return sum;
    }, {
        totalQuestionCount: 0,
        passedQuestionCount: 0
    });
    return {
        items,
        summary
    };
}

function mapRunQuestionsToReportItems(run: RunDto): IQuizReportItem[] {
    return run.questions?.map(q => {
        const answers = mergeAnswers(
            q.questionType,
            q.answerVariants ?? [],
            getRunAnswersForQuestion(run, q.questionId)
        );
        return {
            question: q.text,
            questionType: q.questionType,
            answers,
            isPassed: isQuestionPassed(q.questionType, answers)
        }
    }) ?? [];
}

function getRunAnswersForQuestion(run: RunDto, questionId: string): RunAnswerDto[] {
    return run.report?.filter(a => a.questionId === questionId) ?? [];
}

function mergeAnswers(
    questionType: RunQuestionDto.QuestionTypeEnum,
    variants: RunAnswerVariantDto[],
    runAnswers: RunAnswerDto[]
): IQuizReporAnswer[] {
    let hasMatched = false;
    const result: IQuizReporAnswer[] = [];
    for (const variant of variants) {
        const matched = isAnswerMatched(questionType, variant, runAnswers);
        hasMatched = hasMatched || matched;
        result.push({
            text: variant.text,
            isCorrect: variant.isCorrect ?? false,
            isAnswerMatched: matched
        });
    }
    if (questionType === RunQuestionDto.QuestionTypeEnum.FreeText && !hasMatched) {
        for (const answer of runAnswers) {
            result.push({
                text: answer.text ?? '',
                isCorrect: false,
                isAnswerMatched: true
            });
        }
    }
    return result;
}

function isAnswerMatched(
    questionType: RunQuestionDto.QuestionTypeEnum,
    variant: RunAnswerVariantDto,
    answers: RunAnswerDto[]
): boolean {
    if (questionType === RunQuestionDto.QuestionTypeEnum.FreeText) {
        return answers.some(a => variant.text.trim().toLowerCase() === a.text?.trim().toLowerCase())
    } else {
        return answers.some(a => variant.answerId === a.variantId);
    }
}

function isQuestionPassed(
    questionType: RunQuestionDto.QuestionTypeEnum,
    answers: IQuizReporAnswer[]
): boolean {
    switch(questionType) {
        case RunQuestionDto.QuestionTypeEnum.SingleChoice:
        case RunQuestionDto.QuestionTypeEnum.FreeText:
            return answers.some(a => a.isCorrect && a.isAnswerMatched);
        case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
            return answers.every(a =>
                (a.isCorrect && a.isAnswerMatched) || (!a.isCorrect && !a.isAnswerMatched)
            );
        default:
            return false;
    }
}
