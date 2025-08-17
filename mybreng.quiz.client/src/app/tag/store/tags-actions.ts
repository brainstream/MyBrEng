import { IPostponedEvent } from "@app/shared";
import { TagDto, TagEditDto } from "@app/web-api";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const tagsActions = createActionGroup({
    source: 'Tags',
    events: {
        'Set Loading': props<{ loading: boolean }>(),
        'Set Error': props<{ message: string }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Load List': emptyProps(),
        'List Loaded': props<{ tags: TagDto[] }>(),
        'Save Tag': props<{ tag: TagEditDto }>(),
        'Tag Saved': props<{ tag: TagDto }>(),
        'Delete Tag': props<{ id: string }>(),
        'Tag Deleted': props<{ id: string }>()
    }
});
