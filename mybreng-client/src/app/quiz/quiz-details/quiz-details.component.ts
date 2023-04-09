import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizDetailedDto, QuizEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { LoadingStatus, QuizzesActions, QuizzesSelectors } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizEditFormComponent } from '../quiz-edit-form';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
  private paramsSubscription: Subscription | undefined;
  private quizSubscription: Subscription | undefined;

  quiz: QuizDetailedDto | null;
  readonly loading$: Observable<boolean>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store$: Store,
    private readonly bottomSheet: MatBottomSheet
  ) {
    this.loading$ = store$
      .select(QuizzesSelectors.detailsLoading)
      .pipe(
        map((status) => status === LoadingStatus.Loading)
      );
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.store$.dispatch(QuizzesActions.loadDetails({ id }))
        }
      });
    this.quizSubscription = this.store$.select(QuizzesSelectors.details)
      .subscribe(quiz => this.quiz = quiz);
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    delete this.paramsSubscription;
    this.quizSubscription?.unsubscribe();
    delete this.quizSubscription;
  }

  editQuiz() {
    const quiz = this.quiz;
    if(!quiz) {
      return;
    }
    const bs = this.bottomSheet
      .open(QuizEditFormComponent, {
        data: quiz,
      });
      const subscription = bs.afterDismissed().subscribe((result: QuizEditDto | undefined) => {
        if (result) {
          this.store$.dispatch(QuizzesActions.editDetails({
            id: quiz.id,
            ...result
          }))
        }
        subscription.unsubscribe();
      });
  }
}
