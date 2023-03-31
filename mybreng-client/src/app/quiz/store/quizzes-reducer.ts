
import { createReducer, on } from "@ngrx/store";
import { QuizzesActions } from "./quizzes-actions";
import { IQuizzesState, LoadingStatus } from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState(),
    on(QuizzesActions.startLoading, (state) => ({
        ...state,
        loading: LoadingStatus.Loading
    })),
    on(QuizzesActions.finishLoading, (state, { result }) => ({
        ...state,
        loading: result === 'error' ? LoadingStatus.Error : LoadingStatus.Loaded,
        list: result === 'error' ? [] : result
    }))
);

function createDefaultState(): IQuizzesState {
    return {
        list: [],
        loading: LoadingStatus.None
    };
}