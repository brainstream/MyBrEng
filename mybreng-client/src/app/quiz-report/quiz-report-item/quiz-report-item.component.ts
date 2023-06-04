import { Component, Input } from '@angular/core';
import { RunAnswerDto, RunAnswerVariantDto, RunQuestionDto, RunReportAnswerDto } from '@app/web-api';

export interface IRunReportItem {
    question: RunQuestionDto;
    answer: RunReportAnswerDto | null;
}

interface IAnswer {
    text: string;
    isCorrect: boolean;
    isAnswerMatched: boolean;
}

@Component({
  selector: 'app-quiz-report-item',
  templateUrl: './quiz-report-item.component.html',
  styleUrls: ['./quiz-report-item.component.scss']
})
export class QuizReportItemComponent {
    question: string;
    questionType: RunQuestionDto.QuestionTypeEnum;
    answers: IAnswer[];

    @Input() set data(data: IRunReportItem) {
        this.question = data.question.text;
        this.questionType = data.question.questionType;
        this.answers = this.mergeAnswers(data);
    }

    mergeAnswers(data: IRunReportItem): IAnswer[] {
        const variants = data.question.answerVariants;
        const result: IAnswer[] = [];
        if (!variants) {
            return result;
        }
        let hasMatched = false;
        for (const variant of variants) {
            const isAnswerMatched = this.isAnswerMatched(variant, data.answer);
            hasMatched = hasMatched || isAnswerMatched;
            result.push({
                text: variant.text,
                isCorrect: variant.isCorrect ?? false,
                isAnswerMatched
            });
        }
        if (this.questionType === RunQuestionDto.QuestionTypeEnum.FreeText && !hasMatched) {
            result.push({
                text: data.answer?.text ?? '',
                isCorrect: false,
                isAnswerMatched: true
            });
        }
        return result;
    }

    private isAnswerMatched(variant: RunAnswerVariantDto, answer: RunAnswerDto | null): boolean {
        if (this.questionType === RunQuestionDto.QuestionTypeEnum.FreeText) {
            return variant.text.trim().toLowerCase() === answer?.text?.trim().toLowerCase();
        } else {
            return variant.answerId === answer?.variantId;
        }
    }
}
