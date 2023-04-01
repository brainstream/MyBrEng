import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { LoadingStatus, QuizzesActions, QuizzesSelectors } from '../store';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent {
  quizzes$: Observable<QuizDto[]>;
  loading$: Observable<boolean>;

  constructor(
    store$: Store,
    private readonly bottomSheet: MatBottomSheet
  ) {
    this.quizzes$ = store$.select(QuizzesSelectors.list);
    this.loading$ = store$.select(QuizzesSelectors.listLoading).pipe(
      map((l) => l === LoadingStatus.Loading)
    );
    store$.dispatch(QuizzesActions.loadList());
  }

  showCreateQuizForm() {
    this.bottomSheet.open(QuizEditFormComponent);
  }
}
