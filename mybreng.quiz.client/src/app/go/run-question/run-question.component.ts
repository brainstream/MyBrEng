import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto, RunQuestionDto } from '@app/web-api';
import { MarkdownComponent } from '@app/markdown';
import { RunFreeTextAnswerComponent } from '../run-free-text-answer';
import { RunMultipleChoicesAnswersComponent } from '../run-multiple-choices-answers';
import { RunSingleChoiceAnswersComponent } from '../run-single-choice-answers';
import { RunMatchAnswersComponent } from '../run-match-answers';


@Component({
    selector: 'app-run-question',
    templateUrl: './run-question.component.html',
    styleUrls: ['./run-question.component.scss'],
    imports: [
        MarkdownComponent,
        RunFreeTextAnswerComponent,
        RunMultipleChoicesAnswersComponent,
        RunSingleChoiceAnswersComponent,
        RunMatchAnswersComponent
    ]
})
export class RunQuestionComponent {
    @Input() public question: RunQuestionDto;
    @Input() public answers: string[];
    @Output() public answersChange = new EventEmitter<string[]>();
    @Output() public complete = new EventEmitter<boolean>();

    public get type(): 'text' | 'multi' | 'single' | 'match' {
        switch(this.question.questionType as string) {
            case RunQuestionDto.QuestionTypeEnum.FreeText:
                return 'text';
            case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'multi';
            case RunQuestionDto.QuestionTypeEnum.Match:
                return 'match';
            case RunQuestionDto.QuestionTypeEnum.SingleChoice:
                return 'single';
            default:
                throw new Error(`Unexpected question type: ${this.question.questionType}`);
        }
    }

    public get answerVariants(): RunAnswerVariantDto[] {
        return this.question.answerVariants ?? [];
    }

    public get singleAnswer(): string {
        return this.answers.length > 0 ? this.answers[0] : '';
    }

    public set singleAnswer(value: string) {
        this.answersChange.emit(value ? [value] : []);
    }

    public get allAnswers(): string[] {
        return this.answers;
    }

    public set allAnswers(values: string[]) {
        this.answersChange.emit(values);
    }
}
