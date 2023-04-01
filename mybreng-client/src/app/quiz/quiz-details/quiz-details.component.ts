import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizDetailedDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { LoadingStatus, QuizzesActions, QuizzesSelectors } from '../store';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
  private paramsSubscription: Subscription | undefined;

  readonly quiz$: Observable<QuizDetailedDto | null>;
  readonly loading$: Observable<boolean>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store$: Store
  ) {
    this.quiz$ = store$.select(QuizzesSelectors.details);
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
      }
    );
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.paramsSubscription = undefined;
  }
}
