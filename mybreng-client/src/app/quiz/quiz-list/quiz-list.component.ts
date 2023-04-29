import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto, QuizEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { QuizzesActions, QuizzesSelectors } from '../store';
import { QuizzesEventsService } from '../quizzes-events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit, OnDestroy {
  private quizCreatedSubscription: Subscription;
  
  readonly quizzes$: Observable<QuizDto[]>;
  readonly loading$: Observable<boolean>;

  constructor(
    private readonly store$: Store,
    private readonly bottomSheet: MatBottomSheet,
    private readonly events: QuizzesEventsService,
    private readonly router: Router
  ) {
    this.quizzes$ = store$.select(QuizzesSelectors.list);
    this.loading$ = store$.select(QuizzesSelectors.loading);
    store$.dispatch(QuizzesActions.loadList());
  }
  
  ngOnInit(): void {
    this.quizCreatedSubscription = this.events.quizSaved$.subscribe(quiz => {
      this.router.navigate(['/quiz', quiz.id]);
    });
  }

  ngOnDestroy(): void {
    this.quizCreatedSubscription.unsubscribe();
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
