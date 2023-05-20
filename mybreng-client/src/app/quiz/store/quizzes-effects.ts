import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, tap, from } from "rxjs";
import { quizzesActions } from "./quizzes-actions";
import { QuizzesSelectors } from "./quizzes-selectors";
import { watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";
import { QuizzesEventsService } from "../quizzes-events.service";

@Injectable()
export class QuizzesEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly quizService: QuizService,
        private readonly messageService: MessageService,
        private readonly eventsService: QuizzesEventsService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.flushEvents),
        tap(({ events }) => {
            events.forEach(e => e.flush());
        })
    ), { dispatch: false });

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.loadList),
        concatLatestFrom(() => this.store$.select(QuizzesSelectors.isListLoaded)),
        switchMap(([_, isListLoaded]) => {
            if (isListLoaded) {
                return EMPTY;
            } else {
                return concat(
                    of(quizzesActions.setLoading({ loading: true })),
                    watchHttpErrors(this.quizService.quizList('events'))
                        .pipe(
                            map(quizzes => quizzesActions.listLoaded({ quizzes })),
                            catchError(() => of(quizzesActions.setError({
                                message: 'Во время загрузки списка тестов произошла ошибка'
                            })))
                        ),
                    of(quizzesActions.setLoading({ loading: false }))
                );
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.loadDetails),
        switchMap(({ id }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizDetails(id, 'events'))
                .pipe(
                    map(quiz => quizzesActions.detailsLoaded({ quiz })),
                    catchError(() => of(quizzesActions.setError({
                        message: 'Во время загрузки теста произошла ошибка'
                    })))
                ),
            of(quizzesActions.setLoading({ loading: false }))
        ))
    ));

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.saveDetails),
        switchMap(({ quiz }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizSave({
                id: quiz.id,
                title: quiz.title,
                description: quiz.description
            }, 'events'))
                .pipe(
                    switchMap(quiz => from([
                        quizzesActions.detailsSaved({ quiz }),
                        quizzesActions.flushEvents({
                            events: [
                                this.eventsService.quizSaved$.postpone(quiz)
                            ]
                        })
                    ])),
                    catchError(() => of(quizzesActions.setError({
                        message: 'Во время сохранения теста произошла ошибка'
                    })))
                ),
            of(quizzesActions.setLoading({ loading: false }))
        ))
    ));

    deleteQuiz$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.deleteQuiz),
        switchMap(({ id }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizDelete(id, 'events'))
                .pipe(
                    switchMap(() => from([
                        quizzesActions.quizDeleted({ id }),
                        quizzesActions.flushEvents({
                            events: [
                                this.eventsService.quizDeleted$.postpone({ id })
                            ]
                        })
                    ])),
                    catchError(() => of(quizzesActions.setError({
                        message: 'Во время удаления теста произошла ошибка'
                    })))
                ),
            of(quizzesActions.setLoading({ loading: false }))
        ))
    ));

    saveQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.saveQuestion),
        switchMap(({ question }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizQuestionSave(question, 'events'))
                .pipe(
                    switchMap(question => from([
                        quizzesActions.questionSaved({ question }),
                        quizzesActions.flushEvents({
                            events: [
                                this.eventsService.questionSaved$.postpone({ question })
                            ]
                        })
                    ])),
                    catchError(() => of(quizzesActions.setError({
                        message: 'Во время сохранения вопроса произошла ошибка'
                    })))
                ),
            of(quizzesActions.setLoading({ loading: false }))
        ))
    ));

    deleteQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.deleteQuestion),
        switchMap(({ id }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizQuestionDelete(id, 'events'))
                .pipe(
                    map(_ => quizzesActions.questionDeleted({ id })),
                    catchError(() => of(quizzesActions.setError({
                        message: 'Во время удаления вопроса произошла ошибка'
                    })))
                ),
            of(quizzesActions.setLoading({ loading: false }))
        ))
    ));

    reorderQuestions$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.reorderQuestions),
        switchMap(({ questions, quizId }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizReorderQuestions(quizId, questions, 'events'))
                .pipe(
                    map(questions => quizzesActions.questionsReordered({ quizId, questions })),
                    catchError(() => of(quizzesActions.setError({
                        message: 'Во время сохранения порядка вопросов произошла ошибка'
                    })))
                ),
            of(quizzesActions.setLoading({ loading: false }))
        ))
    ));
}
