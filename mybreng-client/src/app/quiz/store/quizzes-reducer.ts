import { QuizDetailedDto, QuizDto, QuizEditDto, QuizQuestionDto } from "@app/web-api";
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
    on(QuizzesActions.startQuestionSaving, (state, _) => ({
        ...state,
        details: {
            ...state.details,
            loading: LoadingStatus.Loading
        }
    })),
    on(QuizzesActions.finishQuestionSaving, (state, { result }) => {
        if (!state.details?.data) {
            return state;
        }
        return { 
            ...state, 
            details: 'error' in result ? {
                ...state.details,
                loading: LoadingStatus.Error
            } : {
                data: {
                    ...state.details.data,
                    questions: applyQuestion(state.details.data?.questions, result)
                },
                loading: LoadingStatus.Loaded
            }
        };
    }),
    on(QuizzesActions.startQuestionDeletion, (state, _) => ({
        ...state,
        details: {
            ...state.details,
            loading: LoadingStatus.Loading
        }
    })),
    on(QuizzesActions.finishQuestionDeletion, (state, { result }) => {
        if (!state.details?.data) {
            return state;
        }
        return { 
            ...state, 
            details: 'error' in result ? {
                ...state.details,
                loading: LoadingStatus.Error
            } : {
                data: {
                    ...state.details.data,
                    questions: excludeQuestion(state.details.data?.questions, result.id)
                },
                loading: LoadingStatus.Loaded
            }
        };
    }),
    on(QuizzesActions.startQuestionsReordering, (state, _) => ({
        ...state,
        details: {
            ...state.details,
            loading: LoadingStatus.Loading
        }
    })),
    on(QuizzesActions.finishQuestionsReordering, (state, { result }) => {
        if (!state.details?.data) {
            return state;
        }
        return { 
            ...state, 
            details: 'error' in result ? {
                ...state.details,
                loading: LoadingStatus.Error
            } : {
                data: {
                    ...state.details.data,
                    questions: result.questions
                },
                loading: LoadingStatus.Loaded
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

function applyQuestion(list: QuizQuestionDto[] | undefined, question: QuizQuestionDto): QuizQuestionDto[] {
    if (list === undefined) {
        return [question];
    }
    const idx = list.findIndex(q => q.id === question.id);
    if (idx < 0) {
        return [...list, question];
    } else {
        const result = [...list];
        result.splice(idx, 1, question);
        return result;
    }
}

function excludeQuestion(list: QuizQuestionDto[] | undefined, id: string): QuizQuestionDto[] | undefined {
    if (list === undefined) {
        return undefined;
    }
    let result = list;
    const idx = result.findIndex(q => q.id === id);
    if (idx >= 0) {
        result = [...result];
        result.splice(idx, 1);
    }
    return result;
}
