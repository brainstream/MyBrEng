import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, exhaustMap } from "rxjs";
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

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveDetails),
        exhaustMap(({ quiz }) => {
            return concat(
                of(QuizzesActions.startDetailsSaving({ id: quiz.id })),
                this.quizService.quizSave({
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description
                }).pipe(
                    map(() => QuizzesActions.finishDetailsSaving({
                        result: {
                            id: quiz.id,
                            title: quiz.title,
                            description: quiz.description
                        }
                    })),
                    catchError(() => of(QuizzesActions.finishDetailsSaving({
                        result: {
                            id: quiz.id,
                            error: true
                        }
                    })))
                )
            )
        })
    ));

    saveQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveQuestion),
        exhaustMap(({ question }) => {
            return concat(
                of(QuizzesActions.startQuestionSaving({ id: question.id })),
                this.quizService.quizQuestionSave(question).pipe(
                    map(result => QuizzesActions.finishQuestionSaving({ result })),
                    catchError(() => of(QuizzesActions.finishQuestionSaving({
                        result: {
                            id: question.id,
                            error: true
                        }
                    })))
                )
            )
        })
    ));

    deleteQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.deleteQuestion),
        exhaustMap(({ id }) => {
            return concat(
                of(QuizzesActions.startQuestionDeletion({ id })),
                this.quizService.quizQuestionDelete(id).pipe(
                    map(_ => QuizzesActions.finishQuestionDeletion({ 
                        result: { id }
                    })),
                    catchError(() => of(QuizzesActions.finishQuestionDeletion({
                        result: { id, error: true }
                    })))
                )
            )
        })
    ));
}
