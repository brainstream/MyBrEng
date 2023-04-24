import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto, QuizEditDto } from '@app/web-api';
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
    private readonly store$: Store,
    private readonly bottomSheet: MatBottomSheet
  ) {
    this.quizzes$ = store$.select(QuizzesSelectors.list);
    this.loading$ = store$.select(QuizzesSelectors.loading);
    store$.dispatch(QuizzesActions.loadList());
  }

  showCreateQuizForm() {
    const bs = this.bottomSheet.open(QuizEditFormComponent);
    const subscription = bs.afterDismissed().subscribe((result: QuizEditDto | undefined) => {
      subscription.unsubscribe();
      if (result) {
        this.store$.dispatch(QuizzesActions.saveDetails({ quiz: result }));
      }
    });
  }
}
