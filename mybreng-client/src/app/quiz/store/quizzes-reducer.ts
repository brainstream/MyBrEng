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
    on(QuizzesActions.startDetailsSaving, (state, { id }) => {
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
    on(QuizzesActions.finishDetailsSaving, (state, { result }) => {
        if (state.details.data?.id !== result.id) {
            return state;
        }
        if ('error' in result || result.id === undefined) {
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
                data: state.list.data.map(quiz =>
                    quiz.id === result.id ? {
                        ...quiz,
                        title: result.title,
                        description: result.description
                    } : quiz
                )
            },
            details: {                
                loading: LoadingStatus.Loaded,
                data: {
                    ...state.details.data,
                    id: result.id,
                    title: result.title,
                    description: result.description
                }
            }
        };
    }),
    on(QuizzesActions.finishQuestionSaving, (state, { result }) => {
        return state;
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
