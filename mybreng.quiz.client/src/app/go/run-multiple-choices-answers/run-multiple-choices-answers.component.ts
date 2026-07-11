import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-run-multiple-choices-answers',
    templateUrl: './run-multiple-choices-answers.component.html',
    styleUrls: ['./run-multiple-choices-answers.component.scss'],
    imports: [MatCheckbox, NgFor]
})
export class RunMultipleChoicesAnswersComponent {
    @Input() public variants: RunAnswerVariantDto[];
    @Output() public answersChange = new EventEmitter<string[]>();
    @Output() public complete = new EventEmitter<boolean>();
    private _checkedAnswers: string[] = [];

    @Input() public set answers(values: string[]) {
        this._checkedAnswers = values;
    }

    public isChecked(answer: string): boolean {
        return this._checkedAnswers.includes(answer);
    }

    public itemChanged(idx: number, checked: boolean): void {
        const wasComplete = this._checkedAnswers.length > 0;
        const id = this.variants[idx].answerId;
        if(checked) {
            this.addCheckedAnswer(id);
        } else {
            this.removeCheckedAnswer(id);
        }
        this.answersChange.emit(this._checkedAnswers);
        const complete = this._checkedAnswers.length > 0;
        if(wasComplete !== complete) {
            this.complete.emit(complete);
        }
    }

    private addCheckedAnswer(answerId: string): void {
        this._checkedAnswers.push(answerId);
    }

    private removeCheckedAnswer(answerId: string): void {
        const idx = this._checkedAnswers.findIndex(i => i === answerId);
        if(idx >= 0) {
            this._checkedAnswers.splice(idx, 1);
        }
    }
}
