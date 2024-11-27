import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto, RunQuestionDto } from '@app/web-api';

@Component({
    selector: 'app-run-question',
    templateUrl: './run-question.component.html',
    styleUrls: ['./run-question.component.scss'],
    standalone: false
})
export class RunQuestionComponent {
    @Input() question: RunQuestionDto;
    @Input() answers: string[];
    @Output() answersChange = new EventEmitter<string[]>();

    get type(): 'text' | 'multi' | 'single' {
        switch (this.question.questionType) {
            case RunQuestionDto.QuestionTypeEnum.FreeText:
                return 'text';
            case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'multi';
            default:
                return 'single';
        }
    }

    get answerVariants(): RunAnswerVariantDto[] {
        return this.question.answerVariants ?? [];
    }

    get singleAnswer(): string {
        return this.answers && this.answers.length > 0 ? this.answers[0] : '';
    }

    set singleAnswer(value: string) {
        this.answersChange.emit(value ? [value] : []);
    }

    get allAnswers(): string[] {
        return this.answers ?? [];
    }

    set allAnswers(values: string[]) {
        this.answersChange.emit(values);
    }
}
