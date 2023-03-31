import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError } from "rxjs";
import { QuizzesActions } from "./quizzes-actions";
import { QuizzesSelectors } from "./quizzes-selectors";
import { LoadingStatus } from "./quizzes-state";

@Injectable()
export class QuizzesEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly quizService: QuizService
    ) {
    }

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadList),
        concatLatestFrom(() => this.store$.select(QuizzesSelectors.loading)),
        switchMap(([_, loading]) => {
            if (loading == LoadingStatus.None) {
                return concat(
                     of(QuizzesActions.startLoading()),
                     this.quizService.quizList().pipe(
                         map(result => QuizzesActions.finishLoading({ result })),
                         catchError(() => of(QuizzesActions.finishLoading({ result: 'error' })))
                     )
                );
            } else {
                return EMPTY;
            }
        })
    ));
}
