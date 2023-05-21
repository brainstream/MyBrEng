import { Injectable } from "@angular/core";
import { MessageService } from "@app/common";
import { RunService } from "@app/web-api";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { GoEventsService } from "./go-events.service";
import { catchError, concat, map, of, switchMap, tap } from "rxjs";
import { watchHttpErrors } from "@app/shared";
import { goActions } from "./go-actions";

@Injectable()
export class GoEffects {
    constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly runService: RunService,
        private readonly messageService: MessageService,
        private readonly eventsService: GoEventsService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.flushEvents),
        tap(({ events }) => {
            events.forEach(e => e.flush());
        })
    ), { dispatch: false });

    loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.load),
        switchMap(({ id }) => concat(
            of(goActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runGet(id, 'events'))
                .pipe(
                    map(run => goActions.loaded({ run })),
                    catchError(() => of(goActions.setError({
                        message: 'Во время загрузки данных произошла ошибка'
                    })))
                ),
            of(goActions.setLoading({ loading: false }))
        ))
    ));

    finish$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.finish),
        switchMap(({ result }) => concat(
            of(goActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runFinish(result, 'events'))
                .pipe(
                    map(run => goActions.loaded({ run })),
                    catchError(() => of(goActions.setError({
                        message: 'Во время сохранения результатов тестирования произошла ошибка'
                    })))
                ),
            of(goActions.setLoading({ loading: false }))
        ))
    ));
}
