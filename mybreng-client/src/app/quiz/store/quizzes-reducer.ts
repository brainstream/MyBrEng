import { QuizDetailedDto, QuizDto } from "@app/web-api";
import { createReducer, on } from "@ngrx/store";
import { QuizzesActions } from "./quizzes-actions";
import { IQuizzesState, LoadingStatus, RemoteData } from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState(),
    on(QuizzesActions.startListLoading, (state) => ({
        ...state,
        list: new RemoteData<QuizDto[]>([], LoadingStatus.Loading)
    })),
    on(QuizzesActions.finishListLoading, (state, { result }) => ({
        ...state,
        list: new RemoteData<QuizDto[]>(
            result === 'error' ? [] : result,
            result === 'error' ? LoadingStatus.Error : LoadingStatus.Loaded
        )
    })),
    on(QuizzesActions.startDetailsLoading, (state) => ({
        ...state,
        details: new RemoteData<QuizDetailedDto | null>(null, LoadingStatus.Loading)
    })),
    on(QuizzesActions.finishDetailsLoading, (state, { result }) => ({
        ...state,
        details: new RemoteData<QuizDetailedDto | null>(
            result === 'error' ? null : result,
            result === 'error' ? LoadingStatus.Error : LoadingStatus.Loaded
        )
    })),
);

function createDefaultState(): IQuizzesState {
    return {
        list: new RemoteData<QuizDto[]>([], LoadingStatus.None),
        details: new RemoteData<QuizDetailedDto | null>(null, LoadingStatus.None)
    };
}