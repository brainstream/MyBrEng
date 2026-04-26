import { IPostponedEvent } from "@app/shared";
import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {ArtifactDto, ArtifactListDto} from "@app/web-api";

export const artifactsActions = createActionGroup({
    source: 'Artifacts',
    events: {
        'Set Loading': props<{ loading: boolean }>(),
        'Set Error': props<{ message: string }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Upload File': props<{ file: Blob }>(),
        'File Uploaded': props<{ artifact: ArtifactDto }>(),
        'Load List': emptyProps(),
        'List Loaded': props<{ list: ArtifactListDto }>(),
        'Delete File': props<{ id: string }>(),
        'File Deleted': props<{ id: string }>()
    }
});
