import { createReducer, on } from "@ngrx/store";
import { QuizzesActions } from "./quizzes-actions";
import { IQuizzesState } from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState(),
    on(QuizzesActions.setList, (state, { quizzes }) => ({
        ...state,
        list: quizzes
    }))
);

function createDefaultState(): IQuizzesState {
    return {
        list: []
    };
}