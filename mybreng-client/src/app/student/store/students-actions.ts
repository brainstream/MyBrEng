import { IPostponedEvent } from "@app/shared";
import { StudentDto } from "@app/web-api";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const studentsActions = createActionGroup({
    source: 'Students',
    events: {
        'Set Error': props<{ message: string }>(),
        'Set Loading': props<{ loading: boolean }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Load List': emptyProps(),
        'List Loaded': props<{ students: StudentDto[] }>()
    }
});
