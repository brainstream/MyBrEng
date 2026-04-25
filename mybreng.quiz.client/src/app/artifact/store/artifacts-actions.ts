import { IPostponedEvent } from "@app/shared";
import { createActionGroup, props } from "@ngrx/store";

export const artifactsActions = createActionGroup({
    source: 'Artifacts',
    events: {
        'Set Loading': props<{ loading: boolean }>(),
        'Set Error': props<{ message: string }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Upload File': props<{ file: Blob }>(),
        'File Uploaded': props<{ id: string }>()
    }
});
