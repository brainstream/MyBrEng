import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, tap, from } from "rxjs";
import { QuizzesActions } from "./quizzes-actions";
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
        ofType(QuizzesActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.flushEvents),
        tap(({ events }) => {
            events.forEach(e => e.flush());
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
                    of(QuizzesActions.setLoading({ loading: true })),
                    watchHttpErrors(this.quizService.quizList('events'))
                        .pipe(
                            map(result => QuizzesActions.listLoaded({ result })),
                            catchError(() => of(QuizzesActions.setError({
                                message: 'Во время загрузки списка тестов произошла ошибка'
                            })))
                        ),
                    of(QuizzesActions.setLoading({ loading: false }))
                );
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadDetails),
        switchMap(({ id }) => concat(
            of(QuizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizDetails(id, 'events'))
                .pipe(
                    map(result => QuizzesActions.detailsLoaded({ result })),
                    catchError(() => of(QuizzesActions.setError({
                        message: 'Во время загрузки теста произошла ошибка'
                    })))
                ),
            of(QuizzesActions.setLoading({ loading: false }))
        ))
    ));

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveDetails),
        switchMap(({ quiz }) => concat(
            of(QuizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizSave({
                id: quiz.id,
                title: quiz.title,
                description: quiz.description
            }, 'events'))
                .pipe(
                    switchMap(quiz => from([
                        QuizzesActions.detailsSaved({ quiz }),
                        QuizzesActions.flushEvents({
                            events: [
                                this.eventsService.quizSaved$.postpone(quiz)
                            ]
                        })
                    ])),
                    catchError(() => of(QuizzesActions.setError({
                        message: 'Во время сохранения теста произошла ошибка'
                    })))
                ),
            of(QuizzesActions.setLoading({ loading: true }))
        ))
    ));

    deleteQuiz$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.deleteQuiz),
        switchMap(({ id }) => concat(
            of(QuizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizDelete(id, 'events'))
                .pipe(
                    switchMap(() => from([
                        QuizzesActions.quizDeleted({ id }),
                        QuizzesActions.flushEvents({
                            events: [
                                this.eventsService.quizDeleted$.postpone({ id })
                            ]
                        })
                    ])),
                    catchError(() => of(QuizzesActions.setError({
                        message: 'Во время удаления теста произошла ошибка'
                    })))
                ),
            of(QuizzesActions.setLoading({ loading: false }))
        ))
    ));

    saveQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.saveQuestion),
        switchMap(({ question }) => concat(
            of(QuizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizQuestionSave(question, 'events'))
                .pipe(
                    switchMap(question => from([
                        QuizzesActions.questionSaved({ question }),
                        QuizzesActions.flushEvents({
                            events: [
                                this.eventsService.questionSaved$.postpone({ question })
                            ]
                        })
                    ])),
                    catchError(() => of(QuizzesActions.setError({
                        message: 'Во время сохранения вопроса произошла ошибка'
                    })))
                ),
            of(QuizzesActions.setLoading({ loading: false }))
        ))
    ));

    deleteQuestion$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.deleteQuestion),
        switchMap(({ id }) => concat(
            of(QuizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizQuestionDelete(id, 'events'))
                .pipe(
                    map(_ => QuizzesActions.questionDeleted({ id })),
                    catchError(() => of(QuizzesActions.setError({
                        message: 'Во время удаления вопроса произошла ошибка'
                    })))
                ),
            of(QuizzesActions.setLoading({ loading: false }))
        ))
    ));

    reorderQuestions$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.reorderQuestions),
        switchMap(({ questions, quizId }) => concat(
            of(QuizzesActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizReorderQuestions(quizId, questions, 'events'))
                .pipe(
                    map(questions => QuizzesActions.questionsReordered({ quizId, questions })),
                    catchError(() => of(QuizzesActions.setError({
                        message: 'Во время сохранения порядка вопросов произошла ошибка'
                    })))
                ),
            of(QuizzesActions.setLoading({ loading: false }))
        ))
    ));
}
