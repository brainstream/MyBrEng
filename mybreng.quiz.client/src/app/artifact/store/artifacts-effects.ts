import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, concat, EMPTY, from, of, switchMap, tap} from "rxjs";
import {watchHttpErrors} from "@app/shared";
import {ArtifactsService} from "@app/web-api";
import {artifactsActions} from "./artifacts-actions";
import {ArtifactEventsService} from "./artifact-events-service";
import {MessageService} from "@app/common";
import {concatLatestFrom} from "@ngrx/operators";
import {ArtifactSelectors} from "@app/artifact/store/artifacts-selectors";
import {Store} from "@ngrx/store";

@Injectable()
export class ArtifactsEffects {
    constructor(
        private readonly store$: Store,
        private readonly actions$: Actions,
        private readonly artifactsService: ArtifactsService,
        private readonly eventsService: ArtifactEventsService,
        private readonly messageService: MessageService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(artifactsActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(artifactsActions.flushEvents),
        tap(({ events }) => {
            events.forEach(e => e.flush());
        })
    ), { dispatch: false });

    upload$ = createEffect(() => this.actions$.pipe(
        ofType(artifactsActions.uploadFile),
        switchMap(({ file }) => concat(
            of(artifactsActions.setLoading({ loading: true })),
            watchHttpErrors(this.artifactsService.artifactUpload(file, 'events'))
                .pipe(
                    switchMap(artifact => from([
                        artifactsActions.fileUploaded({ artifact }),
                        artifactsActions.flushEvents({
                            events: [
                                this.eventsService.artifactSaved$.postpone({ id: artifact.id }),
                            ]
                        }),
                        artifactsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        artifactsActions.setLoading({ loading: false }),
                        artifactsActions.setError({
                            message: 'Во время сохранения файла произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(artifactsActions.loadList),
        concatLatestFrom(() => this.store$.select(ArtifactSelectors.isListLoaded)),
        switchMap(([_, isListLoaded]) => {
            if (isListLoaded) {
                return EMPTY;
            } else {
                return concat(
                    of(artifactsActions.setLoading({ loading: true })),
                    watchHttpErrors(this.artifactsService.artifactList(undefined, undefined, 'events'))
                        .pipe(
                            switchMap(list => from([
                                artifactsActions.listLoaded({ list }),
                                artifactsActions.setLoading({ loading: false })
                            ])),
                            catchError(() => from([
                                artifactsActions.setLoading({ loading: false }),
                                artifactsActions.setError({
                                    message: 'Во время загрузки списка файлов произошла ошибка'
                                })
                            ]))
                        )
                );
            }
        })
    ));

    delete$ = createEffect(() => this.actions$.pipe(
        ofType(artifactsActions.deleteFile),
        switchMap(({ id }) => concat(
            of(artifactsActions.setLoading({ loading: true })),
            watchHttpErrors(this.artifactsService.artifactDelete(id, 'events'))
                .pipe(
                    switchMap(_ => from([
                        artifactsActions.fileDeleted({ id }),
                        artifactsActions.flushEvents({
                            events: [
                                this.eventsService.artifactDeleted$.postpone({ id })
                            ]
                        }),
                        artifactsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        artifactsActions.setLoading({ loading: false }),
                        artifactsActions.setError({
                            message: 'Во время удаления файла произошла ошибка'
                        })]
                    ))
                )
        ))
    ));
}
