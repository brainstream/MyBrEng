import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IQuiz } from '@app/shared';
import { QuizEditFormComponent } from '../quiz-edit-form';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent {
  quizzes: IQuiz[] = [];

  constructor(private readonly bottomSheet: MatBottomSheet) {
    for (let i = 0; i < 100; ++i) {
      this.quizzes.push({
        id: `q${i}`,
        title: `Quiz #${i}`,
        description: `Description of the Quiz #${i}`
      });
    }
  }

  showCreateQuizForm() {
    this.bottomSheet.open(QuizEditFormComponent);
  }
}
