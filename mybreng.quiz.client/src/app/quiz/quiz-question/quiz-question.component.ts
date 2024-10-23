import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Component({
    selector: 'app-quiz-question',
    templateUrl: './quiz-question.component.html',
    styleUrls: ['./quiz-question.component.scss']
})
export class QuizQuestionComponent {
    @Input() question: QuizQuestionDto;
    @Input() position: number;
    @Output() editRequested = new EventEmitter<QuizQuestionDto>();
    @Output() deleteRequested = new EventEmitter<QuizQuestionDto>();
    @Output() cloneRequested = new EventEmitter<QuizQuestionDto>();

    edit() {
        this.editRequested.emit(this.question);
    }

    delete() {
        this.deleteRequested.emit(this.question);
    }

    clone() {
        this.cloneRequested.emit(this.question);
    }
}
