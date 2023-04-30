import { Injectable } from "@angular/core";
import { StudentService } from "@app/web-api";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { concat, EMPTY, map, switchMap, of, catchError, tap, from } from "rxjs";
import { watchHttpErrors } from "@app/shared";
import { MessageService } from "@app/common";
import { studentsActions } from "./students-actions";
import { StudentsSelectors } from "./students-selectors";

@Injectable()
export class StudentsEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly studentService: StudentService,
        private readonly messageService: MessageService
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
}
