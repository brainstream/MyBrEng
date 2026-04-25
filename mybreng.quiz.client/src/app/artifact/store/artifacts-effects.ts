import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, concat, from, of, switchMap, tap} from "rxjs";
import {watchHttpErrors} from "@app/shared";
import {ArtifactsService} from "@app/web-api";
import {artifactsActions} from "./artifacts-actions";
import {ArtifactEventsService} from "./artifact-events-service";
import {tagsActions} from "@app/tag/store";
import {MessageService} from "@app/common";

@Injectable()
export class ArtifactsEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly artifactsService: ArtifactsService,
        private readonly eventsService: ArtifactEventsService,
        private readonly messageService: MessageService
    ) {
    }

    showError$ = createEffect(() => this.actions$.pipe(
        ofType(tagsActions.setError),
        tap(({ message }) => {
            this.messageService.showError(message)
        })
    ), { dispatch: false });

    flushEvents$ = createEffect(() => this.actions$.pipe(
        ofType(tagsActions.flushEvents),
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
                    switchMap(id => from([
                        artifactsActions.fileUploaded({ id }),
                        artifactsActions.flushEvents({
                            events: [
                                this.eventsService.artifactSaved$.postpone({ id })
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
}
