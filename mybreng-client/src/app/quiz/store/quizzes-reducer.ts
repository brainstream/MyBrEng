import { QuizQuestionDto } from "@app/web-api";
import { createReducer, on } from "@ngrx/store";
import { QuizzesActions } from "./quizzes-actions";
import { IQuizzesState, LoadingStatus, RemoteData } from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState(),
    on(QuizzesActions.startListLoading, (state) => ({
        ...state,
        loadingCounter: incrementLoading(state.loadingCounter)
    })),
    on(QuizzesActions.finishListLoading, (state, { result }) => ({
        ...state,
        loadingCounter: decrementLoading(state.loadingCounter),
        list: result === 'error' ? [] : result
    })),
    on(QuizzesActions.startDetailsLoading, (state) => ({
        ...state,
        loadingCounter: incrementLoading(state.loadingCounter)
    })),
    on(QuizzesActions.finishDetailsLoading, (state, { result }) => ({
        ...state,
        loadingCounter: decrementLoading(state.loadingCounter),
        details: result === 'error' ? null : result
    })),
    on(QuizzesActions.startDetailsSaving, (state, { id }) => ({
        ...state,
        loadingCounter: incrementLoading(state.loadingCounter)
    })),
    on(QuizzesActions.finishDetailsSaving, (state, { result }) => {
        if (state.details?.id !== result.id || result.id === undefined || 'error' in result) {
            return {
                ...state,
                loadingCounter: decrementLoading(state.loadingCounter)
            };
        }
        return {
            ...state,
            loadingCounter: decrementLoading(state.loadingCounter),
            list: state.list.map(quiz =>
                quiz.id === result.id ? {
                    ...quiz,
                    title: result.title,
                    description: result.description
                } : quiz
            ),
            details: {
                ...state.details,
                id: result.id,
                title: result.title,
                description: result.description
            }
        };
    }),
    on(QuizzesActions.startQuestionSaving, (state, _) => ({
        ...state,
        loadingCounter: incrementLoading(state.loadingCounter)
    })),
    on(QuizzesActions.finishQuestionSaving, (state, { result }) => {
        if (!state.details || 'error' in result) {
            return {
                ...state,
                loadingCounter: decrementLoading(state.loadingCounter)
            };
        }
        return {
            ...state,
            loadingCounter: decrementLoading(state.loadingCounter),
            details: {
                ...state.details,
                questions: applyQuestion(state.details?.questions, result)
            }
        };
    }),
    on(QuizzesActions.startQuestionDeletion, (state, _) => ({
        ...state,
        loadingCounter: incrementLoading(state.loadingCounter)
    })),
    on(QuizzesActions.finishQuestionDeletion, (state, { result }) => {
        if (!state.details || 'error' in result) {
            return {
                ...state,
                loadingCounter: decrementLoading(state.loadingCounter)
            };
        }
        return {
            ...state,
            loadingCounter: decrementLoading(state.loadingCounter),
            details: {
                ...state.details,
                questions: excludeQuestion(state.details.questions, result.id)
            }
        };
    }),
    on(QuizzesActions.startQuestionsReordering, (state, _) => ({
        ...state,
        loadingCounter: incrementLoading(state.loadingCounter)
    })),
    on(QuizzesActions.finishQuestionsReordering, (state, { result }) => {
        if (
            !state.details ||
            state.details?.id !== result.quizId ||
            'error' in result
        ) {
            return {
                ...state,
                loadingCounter: decrementLoading(state.loadingCounter)
            };
        }
        return {
            ...state,
            loadingCounter: decrementLoading(state.loadingCounter),
            details: {
                ...state.details,
                questions: result.questions
            }
        };
    })
);

function createDefaultState(): IQuizzesState {
    return {
        loadingCounter: 0,
        list: [],
        details: null
    };
}

function incrementLoading(currentValue: number): number {
    return currentValue + 1;
}

function decrementLoading(currentValue: number): number {
    return currentValue <= 0 ? 0 : currentValue - 1;
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
