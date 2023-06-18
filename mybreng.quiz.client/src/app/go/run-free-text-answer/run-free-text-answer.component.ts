import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-run-free-text-answer',
    templateUrl: './run-free-text-answer.component.html',
    styleUrls: ['./run-free-text-answer.component.scss']
})
export class RunFreeTextAnswerComponent {
    @Input() answer: string;
    @Output() answerChange = new EventEmitter<string>();

    setText(text: string) {
        this.answerChange.emit(text);
    }
}
