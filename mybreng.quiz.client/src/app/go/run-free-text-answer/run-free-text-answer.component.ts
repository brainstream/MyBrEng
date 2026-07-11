import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-run-free-text-answer',
    templateUrl: './run-free-text-answer.component.html',
    styleUrls: ['./run-free-text-answer.component.scss'],
    imports: [MatFormField, MatLabel, MatInput, FormsModule]
})
export class RunFreeTextAnswerComponent {
    @Input() public answer: string;
    @Output() public answerChange = new EventEmitter<string>();
    @Output() public complete = new EventEmitter<boolean>();

    public setText(text: string): void {
        this.answerChange.emit(text);
        this.complete.emit(text.length > 0);
    }
}
