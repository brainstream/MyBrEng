import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-run-single-choice-answers',
    templateUrl: './run-single-choice-answers.component.html',
    styleUrls: ['./run-single-choice-answers.component.scss'],
    imports: [MatRadioGroup, MatRadioButton, FormsModule, NgFor]
})
export class RunSingleChoiceAnswersComponent {
    @Input() public variants: RunAnswerVariantDto[];
    @Output() public answerChange = new EventEmitter<string>();
    @Output() public complete = new EventEmitter<boolean>();
    public _answer: string;

    @Input() public set answer(value: string) {
        this.setAnswer(value);
    }

    public setAnswer(answer: string): void {
        if(!this._answer && answer) {
            this.complete.emit(true);
        }
        this._answer = answer;
        this.answerChange.emit(answer);
    }
}
