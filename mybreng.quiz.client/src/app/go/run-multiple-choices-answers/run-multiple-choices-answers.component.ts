import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';

@Component({
    selector: 'app-run-multiple-choices-answers',
    templateUrl: './run-multiple-choices-answers.component.html',
    styleUrls: ['./run-multiple-choices-answers.component.scss'],
    standalone: false
})
export class RunMultipleChoicesAnswersComponent  {
    private _checkedAnswers: string[] = [];

    @Input() variants: RunAnswerVariantDto[];

    @Input() set answers(values: string[]) {
        this._checkedAnswers = values;
    }

    @Output() answersChange = new EventEmitter<string[]>();
    @Output() complete = new EventEmitter<boolean>();

    isChecked(answer: string): boolean {
        return this._checkedAnswers.includes(answer);
    }

    itemChanged(idx: number, checked: boolean): void {
        const wasComplete = this._checkedAnswers.length > 0;
        const id = this.variants[idx].answerId;
        if (checked) {
            this.addCheckedAnswer(id);
        } else {
            this.removeCheckedAnswer(id);
        }
        this.answersChange.emit(this._checkedAnswers);
        const complete = this._checkedAnswers.length > 0;
        if (wasComplete != complete) {
            this.complete.emit(complete);
        }
    }

    private addCheckedAnswer(answerId: string): void {
        this._checkedAnswers.push(answerId);
    }

    private removeCheckedAnswer(answerId: string): void {
        const idx = this._checkedAnswers.findIndex(i => i === answerId);
        if (idx >= 0) {
            this._checkedAnswers.splice(idx, 1);
        }
    }
}
