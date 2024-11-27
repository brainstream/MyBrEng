import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';

@Component({
    selector: 'app-run-single-choice-answers',
    templateUrl: './run-single-choice-answers.component.html',
    styleUrls: ['./run-single-choice-answers.component.scss'],
    standalone: false
})
export class RunSingleChoiceAnswersComponent {
    @Input() variants: RunAnswerVariantDto[]
    @Input() answer: string;
    @Output() answerChange = new EventEmitter<string>();

    setAnswer(answer: string): void {
        this.answerChange.emit(answer);
    }
}
