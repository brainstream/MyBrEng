import { Component, Input } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.scss']
})
export class QuizQuestionComponent {
  @Input() question: QuizQuestionDto;
}
