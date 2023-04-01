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
        concatLatestFrom(() => this.store$.select(QuizzesSelectors.listLoading)),
        switchMap(([_, loading]) => {
            if (loading == LoadingStatus.None) {
                return concat(
                     of(QuizzesActions.startListLoading()),
                     this.quizService.quizList().pipe(
                         map(result => QuizzesActions.finishListLoading({ result })),
                         catchError(() => of(QuizzesActions.finishListLoading({ result: 'error' })))
                     )
                );
            } else {
                return EMPTY;
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadDetails),
        switchMap(({ id }) => 
            this.quizService.quizDetails(id).pipe(
                map(result => QuizzesActions.finishDetailsLoading({ result })),
                catchError(() => of(QuizzesActions.finishDetailsLoading({ result: 'error' })))
            )
        )
    ));
}
