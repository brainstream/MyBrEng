import { RunAnswerDto, RunAnswerVariantDto, RunDto, RunQuestionDto } from "@app/web-api";

export interface IQuizRepor {
    readonly items: IQuizReportItem[];
}

export interface IQuizReportItem {
    readonly question: string;
    readonly questionType: RunQuestionDto.QuestionTypeEnum;
    readonly answers: IQuizReporAnswer[];
}

export interface IQuizReporAnswer {
    readonly text: string;
    readonly isCorrect: boolean;
    readonly isAnswerMatched: boolean;
}

export function mapRunToReport(run: RunDto): IQuizRepor {
    return {
        items: mapRunQuestionsToReportItems(run)
    };
}

function mapRunQuestionsToReportItems(run: RunDto): IQuizReportItem[] {
    return run.questions?.map(q => ({
        question: q.text,
        questionType: q.questionType,
        answers: mergeAnswers(
            q.questionType,
            q.answerVariants ?? [],
            getRunAnswersForQuestion(run, q.questionId)
        )
    })) ?? [];
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
