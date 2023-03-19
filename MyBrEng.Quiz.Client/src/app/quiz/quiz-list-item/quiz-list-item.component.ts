import { Component, Input } from '@angular/core';
import { IQuiz } from '@app/shared';

@Component({
  selector: 'app-quiz-list-item',
  templateUrl: './quiz-list-item.component.html',
  styleUrls: ['./quiz-list-item.component.scss']
})
export class QuizListItemComponent {
  @Input() quiz: IQuiz;
}
