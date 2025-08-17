import { Injectable } from "@angular/core";
import { QuizService, TagService } from "@app/web-api";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from "@ngrx/store";
import { concat, EMPTY, switchMap, of, catchError, tap, from } from "rxjs";
import { quizzesActions } from "./quizzes-actions";
import { QuizzesSelectors } from "./quizzes-selectors";
import { watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";
import { QuizzesEventsService } from "./quizzes-events.service";


@Injectable()
export class QuizzesEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly quizService: QuizService,
        private readonly tagService: TagService,
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
                            switchMap(quizzes => from([
                                quizzesActions.listLoaded({ quizzes }),
                                quizzesActions.setLoading({ loading: false })
                            ])),
                            catchError(() => from([
                                quizzesActions.setLoading({ loading: false }),
                                quizzesActions.setError({
                                    message: 'Во время загрузки списка тестов произошла ошибка'
                                })
                            ]))
                        )
                );
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.loadDetails),
        switchMap(({ id }) => concat(
            of(quizzesActions.cleanDetails()),
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizDetails(id, 'events'))
                .pipe(
                    switchMap(quiz => from([
                        quizzesActions.detailsLoaded({ quiz }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время загрузки теста произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.saveDetails),
        switchMap(({ quiz }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizSave(quiz, 'events'))
                .pipe(
                    switchMap(quiz => from([
                        quizzesActions.detailsSaved({ quiz }),
                        quizzesActions.flushEvents({
                            events: [
                                this.eventsService.quizSaved$.postpone(quiz)
                            ]
                        }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время сохранения теста произошла ошибка'
                        })
                    ]))
                )
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
                        }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время удаления теста произошла ошибка'
                        })
                    ]))
                )
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
                        }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время сохранения вопроса произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    cloneQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.cloneQuestion),
        switchMap(({ questionId }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizQuestionClone(questionId, 'events'))
                .pipe(
                    switchMap(question => from([
                        quizzesActions.questionCloned({ question }),
                        quizzesActions.flushEvents({
                            events: [
                                this.eventsService.questionCloned$.postpone({ question })
                            ]
                        }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время клонирования вопроса произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    deleteQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.deleteQuestion),
        switchMap(({ id }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizQuestionDelete(id, 'events'))
                .pipe(
                    switchMap(_ => from([
                        quizzesActions.questionDeleted({ id }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время удаления вопроса произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    reorderQuestions$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.reorderQuestions),
        switchMap(({ questions, quizId }) => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizReorderQuestions(quizId, questions, 'events'))
                .pipe(
                    switchMap(questions => from([
                        quizzesActions.questionsReordered({ quizId, questions }),
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.flushEvents({
                            events: [
                                this.eventsService.questionsReordered$.postpone({ questions })
                            ]
                        })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время сохранения порядка вопросов произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    loadAvailableTags$ = createEffect(() => this.actions$.pipe(
        ofType(quizzesActions.loadAvailableTags),
        switchMap(() => concat(
            of(quizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.tagService.tagList(false, true, 'events'))
                .pipe(
                    switchMap(tags => from([
                        quizzesActions.availableTagsLoaded({ tags }),
                        quizzesActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        quizzesActions.setLoading({ loading: false }),
                        quizzesActions.setError({
                            message: 'Во время загрузки списка доступных тегов произошла ошибка'
                        })
                    ]))
                )
        ))
    ));
}
