import { Injectable } from "@angular/core";
import { MessageService } from "@app/common";
import { TagService } from "@app/web-api";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TagsEventsService } from "./tags-events-service";
import { catchError, concat, EMPTY, from, of, switchMap, tap } from "rxjs";
import { tagsActions } from "./tags-actions";
import { TagsSelectors } from "./tags-selectors";
import { watchHttpErrors } from "@app/shared";
import { concatLatestFrom } from "@ngrx/operators";

@Injectable()
export class TagsEffects {
constructor(
        private readonly actions$: Actions,
        private store$: Store,
        private readonly tagService: TagService,
        private readonly messageService: MessageService,
        private readonly eventsService: TagsEventsService
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

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(tagsActions.loadList),
        concatLatestFrom(() => this.store$.select(TagsSelectors.isListLoaded)),
        switchMap(([_, isListLoaded]) => {
            if (isListLoaded) {
                return EMPTY;
            } else {
                return concat(
                    of(tagsActions.setLoading({ loading: true })),
                    watchHttpErrors(this.tagService.tagList('events'))
                        .pipe(
                            switchMap(tags => from([
                                tagsActions.listLoaded({ tags }),
                                tagsActions.setLoading({ loading: false })
                            ])),
                            catchError(() => from([
                                tagsActions.setLoading({ loading: false }),
                                tagsActions.setError({
                                    message: 'Во время загрузки списка тегов произошла ошибка'
                                })
                            ]))
                        )
                );
            }
        })
    ));

    save$ = createEffect(() => this.actions$.pipe(
        ofType(tagsActions.saveTag),
        switchMap(({ tag }) => concat(
            of(tagsActions.setLoading({ loading: true })),
            watchHttpErrors(this.tagService.tagSave(tag, 'events'))
                .pipe(
                    switchMap(tag => from([
                        tagsActions.tagSaved({ tag }),
                        tagsActions.flushEvents({
                            events: [
                                this.eventsService.tagSaved$.postpone(tag)
                            ]
                        }),
                        tagsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        tagsActions.setLoading({ loading: false }),
                        tagsActions.setError({
                            message: 'Во время сохранения тега произошла ошибка'
                        })
                    ]))
                )
        ))
    ));

    delete$ = createEffect(() => this.actions$.pipe(
        ofType(tagsActions.deleteTag),
        switchMap(({ id }) => concat(
            of(tagsActions.setLoading({ loading: true })),
            watchHttpErrors(this.tagService.tagDelete(id, 'events'))
                .pipe(
                    switchMap(_ => from([
                        tagsActions.tagDeleted({ id }),
                        tagsActions.flushEvents({
                            events: [
                                this.eventsService.tagDeleted$.postpone({ id })
                            ]
                        }),
                        tagsActions.setLoading({ loading: false })
                    ])),
                    catchError(() => from([
                        tagsActions.setLoading({ loading: false }),
                        tagsActions.setError({
                            message: 'Во время удаления тега произошла ошибка'
                        })]
                    ))
                )
        ))
    ));
}
