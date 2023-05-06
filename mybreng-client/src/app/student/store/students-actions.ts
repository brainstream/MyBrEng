import { IPostponedEvent } from "@app/shared";
import { StudentDetailedDto, StudentDto, StudentEditDto } from "@app/web-api";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const studentsActions = createActionGroup({
    source: 'Students',
    events: {
        'Set Error': props<{ message: string }>(),
        'Set Loading': props<{ loading: boolean }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Load List': emptyProps(),
        'List Loaded': props<{ students: StudentDto[] }>(),
        'Load Details': props<{ id: string }>(),
        'Details Loaded': props<{ student: StudentDetailedDto }>(),
        'Save Details': props<{ student: StudentEditDto }>(),
        'Details Saved': props<{ student: StudentDto }>()
    }
});
