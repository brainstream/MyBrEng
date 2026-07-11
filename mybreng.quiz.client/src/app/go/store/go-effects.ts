import { Injectable } from '@angular/core';
import { MessageService } from '@app/common';
import { RunService } from '@app/web-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concat, from, of, switchMap, tap } from 'rxjs';
import { watchHttpErrors } from '@app/shared';
import { goActions } from './go-actions';

@Injectable()
export class GoEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly store$: Store,
        private readonly runService: RunService,
        private readonly messageService: MessageService
    ) {
    }

    public showError$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message);
        })
    ), { dispatch: false });

    public flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.flushEvents),
        tap(({ events }) => {
            events.forEach(e => e.flush());
        })
    ), { dispatch: false });

    public loadDetails$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.load),
        switchMap(({ id }) => concat(
            of(goActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runGet(id, 'events'))
                .pipe(
                    switchMap(run => from([
                        goActions.loaded({ run }),
                        goActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        goActions.setLoading({ loading: false }),
                        goActions.setError({
                            message: 'Во время загрузки данных произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    public finish$ = createEffect(() => this.actions$.pipe(
        ofType(goActions.finish),
        switchMap(({ result }) => concat(
            of(goActions.setLoading({ loading: true })),
            watchHttpErrors(this.runService.runFinish(result, 'events'))
                .pipe(
                    switchMap(run => from([
                        goActions.loaded({ run }),
                        goActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        goActions.setLoading({ loading: false }),
                        goActions.setError({
                            message: 'Во время сохранения результатов тестирования произошла ошибка'
                        })
                    ]))
                )
        ))
    ));
}
