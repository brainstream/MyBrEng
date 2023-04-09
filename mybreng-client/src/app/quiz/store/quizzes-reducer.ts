import { QuizDetailedDto, QuizDto, QuizEditDto } from "@app/web-api";
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
            result === 'error' ? null : prepareDetails(result),
            result === 'error' ? LoadingStatus.Error : LoadingStatus.Loaded
        )
    })),
    on(QuizzesActions.startDetailsEditing, (state, { id }) => {
        if (state.details.data?.id !== id) {
            return state;
        }
        return {
            ...state,
            details: {
                ...state.details,
                loading: LoadingStatus.Loading
            }
        };
    }),
    on(QuizzesActions.finishDetailsEditing, (state, { id, result }) => {
        if (state.details.data?.id !== id) {
            return state;
        }
        if (result === 'error') {
            return {
                ...state,
                details: {
                    ...state.details,
                    loading: LoadingStatus.Error
                }
            };
        }
        return {
            ...state,
            list: {
                ...state.list,
                data: state.list.data.map(quiz => quiz.id === id ? {
                    ...quiz,
                    title: result.title,
                    description: result.description
                } : quiz)
            },
            details: {
                loading: LoadingStatus.Loaded,
                data: {
                    ...state.details.data,
                    title: result.title,
                    description: result.description
                }
            }
        };
    })
);

function createDefaultState(): IQuizzesState {
    return {
        list: new RemoteData<QuizDto[]>([], LoadingStatus.None),
        details: new RemoteData<QuizDetailedDto | null>(null, LoadingStatus.None)
    };
}

function prepareDetails(quiz: QuizDetailedDto): QuizDetailedDto {
    const questions = quiz.questions ? [...quiz.questions] : [];
    if (quiz.questions) {
        questions.sort((left, right) => left.ordinal_number < right.ordinal_number ? -1 : 1)
    }
    return {
        ...quiz,
        questions
    };
}
