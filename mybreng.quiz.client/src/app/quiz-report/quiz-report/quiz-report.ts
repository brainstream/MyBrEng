import { MatchingAnswer } from "@app/shared";
import { RunAnswerDto, RunAnswerVariantDto, RunDto, RunQuestionDto } from "@app/web-api";

export interface IQuizReport {
    readonly title: string;
    readonly description: string;
    readonly items: IQuizReportItem[];
    readonly summary: IQuizReportSummary;
}

export interface IQuizReportSummary {
    totalQuestionCount: number;
    passedQuestionCount: number;
}

export interface IQuizReportItem {
    readonly question: string;
    readonly questionType: RunQuestionDto.QuestionTypeEnum;
    readonly answers: IQuizReportAnswer[];
    readonly isPassed: boolean;
}

export interface IQuizReportAnswer {
    readonly text: string;
    readonly isCorrect: boolean;
    readonly isAnswerMatched: boolean;
}

export function mapRunToReport(run: RunDto): IQuizReport {
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
        title: run.title,
        description: run.description,
        items,
        summary
    };
}

function mapRunQuestionsToReportItems(run: RunDto): IQuizReportItem[] {
    return run.questions?.map(q => {
        const answers = AnswerMerger.mergeAnswers(
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

class AnswerMerger {
    static mergeAnswers(
        questionType: RunQuestionDto.QuestionTypeEnum,
        variants: RunAnswerVariantDto[],
        runAnswers: RunAnswerDto[]
    ): IQuizReportAnswer[] {
        return questionType === RunQuestionDto.QuestionTypeEnum.Match
            ? AnswerMerger.mergeMatchingAnswers(variants, runAnswers)
            : AnswerMerger.mergeRegularAnswers(questionType, variants, runAnswers);
    }

    private static mergeRegularAnswers(
        questionType: RunQuestionDto.QuestionTypeEnum,
        variants: RunAnswerVariantDto[],
        runAnswers: RunAnswerDto[]
    ): IQuizReportAnswer[] {
        let hasMatched = false;
        const result: IQuizReportAnswer[] = [];
        for (const variant of variants) {
            const matched = AnswerMerger.isAnswerMatched(questionType, variant, runAnswers);
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

    private static isAnswerMatched(
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

    private static mergeMatchingAnswers(
        variants: RunAnswerVariantDto[],
        runAnswers: RunAnswerDto[]
    ): IQuizReportAnswer[] {
        const formatText = (a: MatchingAnswer) => `${a.slot} ➡️ ${a.answer}`;
        const answers = runAnswers.map(a => {
            return a.text ? formatText(JSON.parse(a.text) as MatchingAnswer) : '';
        });
        const result: IQuizReportAnswer[] = [];
        for (const variant of variants) {
            const matchingAnswer = JSON.parse(variant.text) as MatchingAnswer;
            if (matchingAnswer.slot == null) {
                continue;
            }
            const text = formatText(matchingAnswer);
            const answerIndex = answers.findIndex(a => a === text);
            if (answerIndex >= 0) {
                answers.splice(answerIndex, 1);
            }
            result.push({
                text,
                isCorrect: true,
                isAnswerMatched: answerIndex >= 0
            });
        }
        for (const answer of answers) {
            result.push({
                text: answer,
                isCorrect: false,
                isAnswerMatched: true
            });
        }
        return result;
    }
}

function isQuestionPassed(
    questionType: RunQuestionDto.QuestionTypeEnum,
    answers: IQuizReportAnswer[]
): boolean {
    switch(questionType) {
        case RunQuestionDto.QuestionTypeEnum.SingleChoice:
        case RunQuestionDto.QuestionTypeEnum.FreeText:
            return answers.some(a => a.isCorrect && a.isAnswerMatched);
        case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
            return answers.every(a =>
                (a.isCorrect && a.isAnswerMatched) || (!a.isCorrect && !a.isAnswerMatched)
            );
        case RunQuestionDto.QuestionTypeEnum.Match:
            return answers.every(a => a.isCorrect && a.isAnswerMatched);
        default:
            return false;
    }
}
