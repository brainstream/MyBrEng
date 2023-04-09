import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Component({
  selector: 'app-quiz-question-edit-form',
  templateUrl: './quiz-question-edit-form.component.html',
  styleUrls: ['./quiz-question-edit-form.component.scss']
})
export class QuizQuestionEditFormComponent {
  @Input() question: QuizQuestionDto;
  @Output() cancelRequested = new EventEmitter<QuizQuestionDto>();

  cancel() {
    this.cancelRequested.emit(this.question);
  }
}
