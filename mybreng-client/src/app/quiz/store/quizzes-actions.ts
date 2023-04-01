import { QuizDetailedDto, QuizDto } from "@app/web-api";
import { createAction, props } from "@ngrx/store";

export namespace QuizzesActions {
    export const loadList = createAction(
        '[Quizzes] Load List'
    );
    export const startListLoading = createAction(
        '[Quizzes] Start List Loading'
    );
    export const finishListLoading = createAction(
        '[Quizzes] Finish List Loading',
        props<{ result: QuizDto[] | 'error' }>()
    );
    export const loadDetails = createAction(
        '[Quizzes] Load Details',
        props<{ id: string }>()
    );
    export const startDetailsLoading = createAction(
        '[Quizzes] Start Details Loading'
    );
    export const finishDetailsLoading = createAction(
        '[Quizzes] Finish Details Loading',
        props<{ result: QuizDetailedDto | 'error' }>()
    );
}