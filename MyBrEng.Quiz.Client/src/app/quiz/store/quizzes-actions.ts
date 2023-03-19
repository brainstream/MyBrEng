import { QuizDto } from "@app/web-api";
import { createAction, props } from "@ngrx/store";

export namespace QuizzesActions {
    export const loadList = createAction('[Quizzes] Load List');
    export const setList = createAction('[Quizzes] Set List', props<{quizzes: QuizDto[]}>())
}