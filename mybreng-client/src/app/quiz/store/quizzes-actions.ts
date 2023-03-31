import { QuizDto } from "@app/web-api";
import { createAction, props } from "@ngrx/store";

export namespace QuizzesActions {
    export const loadList = createAction('[Quizzes] Load List');
    export const startLoading = createAction('[Quizzes] Start Loading');
    export const finishLoading = createAction(
        '[Quizzes] Finish Loading',
        props<{ result: QuizDto[] | 'error' }>()
    );
}