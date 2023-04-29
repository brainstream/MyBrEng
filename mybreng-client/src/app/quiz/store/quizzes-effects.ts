import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, tap, from } from "rxjs";
import { QuizzesActions } from "./quizzes-actions";
import { QuizzesSelectors } from "./quizzes-selectors";
import { Queue, watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";
import { QuizzesEventsService } from "../quizzes-events.service";

@Injectable()
export class QuizzesEffects {
    private readonly events = new Queue<Function>();

    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly quizService: QuizService,
        private readonly messageService: MessageService,
        private readonly eventsService: QuizzesEventsService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.flushEvents),
        tap(() => {
            for (let e = this.events.pop(); e; e = this.events.pop()) {
                e();
            }
        })
    ), { dispatch: false });

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadList),
        concatLatestFrom(() => this.store$.select(QuizzesSelectors.isListLoaded)),
        switchMap(([_, isListLoaded]) => {
            if (isListLoaded) {
                return EMPTY;
            } else {
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
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadDetails),
        switchMap(({ id }) => concat(
            of(QuizzesActions.startDetailsLoading()),
            watchHttpErrors(this.quizService.quizDetails(id, 'events'))
                .pipe(
                    map(result => QuizzesActions.finishDetailsLoading({ result })),
                    catchError(() => from([
                        QuizzesActions.finishDetailsLoading({ result: 'error' }),
                        QuizzesActions.setError({
                            message: 'Во время загрузки теста произошла ошибка'
                        })
                    ]))
                )))
    ));

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveDetails),
        switchMap(({ quiz }) => concat(
            of(QuizzesActions.startDetailsSaving({ id: quiz.id })),
            watchHttpErrors(this.quizService.quizSave({
                id: quiz.id,
                title: quiz.title,
                description: quiz.description
            }, 'events'))
                .pipe(
                    switchMap(result => {
                        this.events.push(() => {
                            this.eventsService.raiseQuizSaved(result);
                        });
                        return from([
                            QuizzesActions.finishDetailsSaving({ result }),
                            QuizzesActions.flushEvents()
                        ]);
                    }),
                    catchError(() => from([
                        QuizzesActions.finishDetailsSaving({
                            result: {
                                id: quiz.id,
                                error: true
                            }
                        }),
                        QuizzesActions.setError({
                            message: 'Во время сохранения теста произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    saveQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveQuestion),
        switchMap(({ question }) => concat(
            of(QuizzesActions.startQuestionSaving({ id: question.id })),
            watchHttpErrors(this.quizService.quizQuestionSave(question, 'events'))
                .pipe(
                    map(result => QuizzesActions.finishQuestionSaving({ result })),
                    catchError(() => from([
                        QuizzesActions.finishQuestionSaving({
                            result: {
                                id: question.id,
                                error: true
                            }
                        }),
                        QuizzesActions.setError({
                            message: 'Во время сохранения вопроса произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    deleteQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.deleteQuestion),
        switchMap(({ id }) => concat(
            of(QuizzesActions.startQuestionDeletion({ id })),
            watchHttpErrors(this.quizService.quizQuestionDelete(id, 'events'))
                .pipe(
                    map(_ => QuizzesActions.finishQuestionDeletion({
                        result: { id }
                    })),
                    catchError(() => from([
                        QuizzesActions.finishQuestionDeletion({
                            result: { id, error: true }
                        }),
                        QuizzesActions.setError({
                            message: 'Во время удаления вопроса произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    reorderQuestions$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.reorderQuestions),
        switchMap(({ questions, quizId }) => concat(
            of(QuizzesActions.startQuestionsReordering({ quizId })),
            watchHttpErrors(this.quizService.quizReorderQuestions(quizId, questions, 'events'))
                .pipe(
                    map(q => QuizzesActions.finishQuestionsReordering({
                        result: { quizId, questions: q }
                    })),
                    catchError(() => from([
                        QuizzesActions.finishQuestionsReordering({
                            result: { quizId, error: true }
                        }),
                        QuizzesActions.setError({
                            message: 'Во время сохранения порядка вопросов произошла ошибка'
                        })
                    ]))
                )
        ))
    ));
}
