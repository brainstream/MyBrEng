import { Injectable } from "@angular/core";
import { QuizService, RunService, StudentService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, tap, from } from "rxjs";
import { watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";
import { studentsActions } from "./students-actions";
import { StudentsSelectors } from "./students-selectors";
import { StudentEventsService } from "../student-events.service";

@Injectable()
export class StudentsEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly studentService: StudentService,
        private readonly quizService: QuizService,
        private readonly runService: RunService,
        private readonly messageService: MessageService,
        private readonly eventsService: StudentEventsService
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
                            map(students => studentsActions.listLoaded({ students })),
                            catchError(() => of(studentsActions.setError({
                                message: 'Во время загрузки списка учеников произошла ошибка'
                            })))
                        ),
                    of(studentsActions.setLoading({ loading: false }))
                );
            }
        })
    ));

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.loadDetails),
        switchMap(({ id }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.studentService.studentDetails(id, 'events'))
                .pipe(
                    map(student => studentsActions.detailsLoaded({ student })),
                    catchError(() => of(studentsActions.setError({
                        message: 'Во время загрузки данных ученика произошла ошибка'
                    })))
                ),
            of(studentsActions.setLoading({ loading: false }))
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
                        })
                    ])),
                    catchError(() => of(studentsActions.setError({
                        message: 'Во время сохранения теста произошла ошибка'
                    })))
                ),
            of(studentsActions.setLoading({ loading: false }))
        ))
    ));

    loadAvailableQuizzes$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.loadAvailableQuizzes),
        concatLatestFrom(() => this.store$.select(StudentsSelectors.isAvailableQuizzesLoaded)),
        switchMap(([_, isAvailableQuizzesLoaded]) => {
            if (isAvailableQuizzesLoaded) {
                return EMPTY;
            } else {
                return concat(
                    of(studentsActions.setLoading({ loading: true })),
                    watchHttpErrors(this.quizService.quizList('events'))
                        .pipe(
                            map(quizzes => studentsActions.availableQuizzesLoaded({ quizzes })),
                            catchError(() => of(studentsActions.setError({
                                message: 'Во время загрузки списка доступных тестов произошла ошибка'
                            })))
                        ),
                    of(studentsActions.setLoading({ loading: false }))
                );
            }
        })
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
                        })
                    ])),
                    catchError(() => of(studentsActions.setError({
                        message: 'Во время добавления теста произошла ошибка'
                    })))
                ),
            of(studentsActions.setLoading({ loading: false }))
        ))
    ));

    deleteRun$ = createEffect(() => this.actions$.pipe(
        ofType(studentsActions.deleteRun),
        switchMap(({ id }) => concat(
            of(studentsActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runDelete(id, 'events'))
                .pipe(
                    map(_ => studentsActions.runDeleted({ id })),
                    catchError(() => of(studentsActions.setError({
                        message: 'Во время удаления теста произошла ошибка'
                    })))
                ),
            of(studentsActions.setLoading({ loading: false }))
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
                        })
                    ])),
                    catchError(() => of(studentsActions.setError({
                        message: 'Во время удаления ученика произошла ошибка'
                    })))
                ),
            of(studentsActions.setLoading({ loading: false }))
        ))
    ));
}
