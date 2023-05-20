import { IPostponedEvent } from "@app/shared";
import { RunDto } from "@app/web-api";
import { createActionGroup, props } from "@ngrx/store";

export const goActions = createActionGroup({
    source: 'Go',
    events: {
        'Set Error': props<{ message: string }>(),
        'Set Loading': props<{ loading: boolean }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Load': props<{ id: string }>(),
        'Loaded': props<{ run: RunDto }>()
    }
});
