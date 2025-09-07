import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';

@Component({
    selector: 'app-run-single-choice-answers',
    templateUrl: './run-single-choice-answers.component.html',
    styleUrls: ['./run-single-choice-answers.component.scss'],
    standalone: false
})
export class RunSingleChoiceAnswersComponent {
    _answer: string;

    @Input() variants: RunAnswerVariantDto[]

    @Input() set answer(value: string) {
        this.setAnswer(value);
    }

    @Output() answerChange = new EventEmitter<string>();
    @Output() complete = new EventEmitter<boolean>();

    setAnswer(answer: string): void {
        if (!this._answer && answer) {
            this.complete.emit(true);
        }
        this._answer = answer;
        this.answerChange.emit(answer);
    }
}
