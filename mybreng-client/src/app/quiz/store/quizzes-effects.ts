import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, tap } from "rxjs";
import { QuizzesActions } from "./quizzes-actions";
import { QuizzesSelectors } from "./quizzes-selectors";
import { watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";

@Injectable()
export class QuizzesEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly quizService: QuizService,
        private readonly messageService: MessageService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadList),
        concatLatestFrom(() => this.store$.select(QuizzesSelectors.list)),
        switchMap(([_, list]) => {
            if (list.length == 0) {
                return concat(
                    of(QuizzesActions.startListLoading()),
                    watchHttpErrors(this.quizService.quizList('events'))
                        .pipe(
                            map(result => QuizzesActions.finishListLoading({ result })),
                            catchError(() => concat(
                                of(QuizzesActions.finishListLoading({ result: 'error' })),
                                of(QuizzesActions.setError({
                                    message: 'Во время загрузки списка тестов произошла ошибка'
                                }))
                            ))
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
            watchHttpErrors(this.quizService.quizDetails(id, 'events'))
                .pipe(
                    map(result => QuizzesActions.finishDetailsLoading({ result })),
                    catchError(() => concat(
                        of(QuizzesActions.finishDetailsLoading({ result: 'error' })),
                        of(QuizzesActions.setError({
                            message: 'Во время загрузки теста произошла ошибка'
                        }))
                    ))
                )))
    );

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveDetails),
        switchMap(({ quiz }) => {
            return concat(
                of(QuizzesActions.startDetailsSaving({ id: quiz.id })),
                watchHttpErrors(this.quizService.quizSave({
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description
                }, 'events'))
                    .pipe(
                        map(result => QuizzesActions.finishDetailsSaving({ result })),
                        catchError(() => concat(
                            of(QuizzesActions.finishDetailsSaving({
                                result: {
                                    id: quiz.id,
                                    error: true
                                }
                            })),
                            of(QuizzesActions.setError({
                                message: 'Во время сохранения теста произошла ошибка'
                            }))
                        ))
                    )
            )
        })
    ));

    saveQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveQuestion),
        switchMap(({ question }) => {
            return concat(
                of(QuizzesActions.startQuestionSaving({ id: question.id })),
                watchHttpErrors(this.quizService.quizQuestionSave(question, 'events'))
                    .pipe(
                        map(result => QuizzesActions.finishQuestionSaving({ result })),
                        catchError(() => concat(
                            of(QuizzesActions.finishQuestionSaving({
                                result: {
                                    id: question.id,
                                    error: true
                                }
                            })),
                            of(QuizzesActions.setError({
                                message: 'Во время сохранения вопроса произошла ошибка'
                            }))
                        ))
                    )
            )
        })
    ));

    deleteQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.deleteQuestion),
        switchMap(({ id }) => {
            return concat(
                of(QuizzesActions.startQuestionDeletion({ id })),
                watchHttpErrors(this.quizService.quizQuestionDelete(id, 'events'))
                    .pipe(
                        map(_ => QuizzesActions.finishQuestionDeletion({
                            result: { id }
                        })),
                        catchError(() => concat(
                            of(QuizzesActions.finishQuestionDeletion({
                                result: { id, error: true }
                            })),
                            of(QuizzesActions.setError({
                                message: 'Во время удаления вопроса произошла ошибка'
                            }))
                        ))
                    )
            )
        })
    ));

    reorderQuestions$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.reorderQuestions),
        switchMap(({ questions, quizId }) => {
            return concat(
                of(QuizzesActions.startQuestionsReordering({ quizId })),
                watchHttpErrors(this.quizService.quizReorderQuestions(quizId, questions, 'events'))
                    .pipe(
                        map(q => QuizzesActions.finishQuestionsReordering({
                            result: { quizId, questions: q }
                        })),
                        catchError(() => concat(
                            of(QuizzesActions.finishQuestionsReordering({
                                result: { quizId, error: true }
                            })),
                            of(QuizzesActions.setError({ 
                                message: 'Во время сохранения порядка вопросов произошла ошибка'
                            }))
                        ))
                    )
            )
        })
    ));
}
