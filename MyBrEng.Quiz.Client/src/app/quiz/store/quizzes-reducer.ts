import { createReducer } from "@ngrx/store";
import { IQuizzesState } from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState()
);

function createDefaultState(): IQuizzesState {
    return {};
}