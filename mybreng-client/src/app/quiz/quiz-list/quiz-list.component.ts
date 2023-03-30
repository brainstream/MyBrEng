import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { QuizzesActions, QuizzesSelectors } from '../store';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent {
  quizzes$: Observable<QuizDto[]>;

  constructor(
    store$: Store,
    private readonly bottomSheet: MatBottomSheet
  ) {
    this.quizzes$ = store$.select(QuizzesSelectors.list);
    store$.dispatch(QuizzesActions.loadList());
  }

  showCreateQuizForm() {
    this.bottomSheet.open(QuizEditFormComponent);
  }
}
