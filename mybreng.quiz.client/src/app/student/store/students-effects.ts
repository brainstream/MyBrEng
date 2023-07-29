import { Injectable } from "@angular/core";
import { QuizService, RunService, StudentService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, switchMap, of, catchError, tap, from } from "rxjs";
import { watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";
import { studentsActions } from "./students-actions";
import { StudentsSelectors } from "./students-selectors";
import { StudentsEventsService } from "./students-events.service";

@Injectable()
export class StudentsEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly studentService: StudentService,
        private readonly quizService: QuizService,
        private readonly runService: RunService,
        private readonly messageService: MessageService,
        private readonly eventsService: StudentsEventsService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.flushEvents),
        tap(({ events }) => {
            events.forEach(e => e.flush());
        })
    ), { dispatch: false });

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.loadList),
        concatLatestFrom(() => this.store$.select(StudentsSelectors.isListLoaded)),
        switchMap(([_, isListLoaded]) => {
            if (isListLoaded) {
                return EMPTY;
            } else {
                return concat(
                    of(studentsActions.setLoading({ loading: true })),
                    watchHttpErrors(this.studentService.studentList('events'))
                        .pipe(
                            switchMap(students => from([
                                studentsActions.listLoaded({ students }),
                                studentsActions.setLoading({ loading: false })
                            ])),
                            catchError(() => from([
                                studentsActions.setLoading({ loading: false }),
                                studentsActions.setError({
                                    message: 'Во время загрузки списка учеников произошла ошибка'
                                })
                            ]))
                        )
                );
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.loadDetails),
        switchMap(({ id }) => concat(
            of(studentsActions.cleanDetails()),
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.studentService.studentDetails(id, 'events'))
                .pipe(
                    switchMap(student => from([
                        studentsActions.detailsLoaded({ student }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время загрузки данных ученика произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    saveDetails$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.saveDetails),
        switchMap(({ student }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.studentService.studentSave(student, 'events'))
                .pipe(
                    switchMap(student => from([
                        studentsActions.detailsSaved({ student }),
                        studentsActions.flushEvents({
                            events: [
                                this.eventsService.studentSaved$.postpone(student)
                            ]
                        }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время сохранения данных ученика произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    loadAvailableQuizzes$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.loadAvailableQuizzes),
        switchMap(() => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.quizService.quizList('events'))
                .pipe(
                    switchMap(quizzes => from([
                        studentsActions.availableQuizzesLoaded({ quizzes }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время загрузки списка доступных тестов произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    addRun$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.addRun),
        switchMap(({ run }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runCreate(run, 'events'))
                .pipe(
                    switchMap(run => from([
                        studentsActions.runAdded({ run }),
                        studentsActions.flushEvents({
                            events: [
                                this.eventsService.runCreated$.postpone(run)
                            ]
                        }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время добавления теста произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    deleteRun$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.deleteRun),
        switchMap(({ id }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runDelete(id, 'events'))
                .pipe(
                    switchMap(_ => from([
                        studentsActions.runDeleted({ id }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время удаления теста произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    deleteStudent$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.deleteStudent),
        switchMap(({ id }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.studentService.studentDelete(id, 'events'))
                .pipe(
                    switchMap(_ => from([
                        studentsActions.studentDeleted({ id }),
                        studentsActions.flushEvents({
                            events: [
                                this.eventsService.studentDeleted$.postpone({ id })
                            ]
                        }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время удаления ученика произошла ошибка'
                        })]
                    ))
                )
        ))
    ));

    setNote$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.setNote),
        switchMap(({ dto }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.studentService.studentSetNote(dto, 'events'))
                .pipe(
                    switchMap(_ => from([
                        studentsActions.noteSaved({ dto }),
                        studentsActions.flushEvents({
                            events: [
                                this.eventsService.noteSaved$.postpone({ ...dto })
                            ]
                        }),
                        studentsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        studentsActions.setLoading({ loading: false }),
                        studentsActions.setError({
                            message: 'Во время сохранения заметки произошла ошибка'
                        })
                    ]))
                )
        ))
    ));
}
