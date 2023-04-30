import { QuizDto, QuizQuestionDto } from "@app/web-api";
import { createReducer, on } from "@ngrx/store";
import { QuizzesActions } from "./quizzes-actions";
import { IQuizzesState } from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState(),

    on(QuizzesActions.setLoading, (state, { loading }) => ({
        ...state,
        loadingCounter: loading
            ? state.loadingCounter + 1
            : (state.loadingCounter <= 0 ? 0 : state.loadingCounter - 1)
    })),

    on(QuizzesActions.listLoaded, (state, { result }) => ({
        ...state,
        list: result === 'error' ? [] : result
    })),

    on(QuizzesActions.detailsLoaded, (state, { result }) => ({
        ...state,
        details: result === 'error' ? null : result
    })),

    on(QuizzesActions.detailsSaved, (state, { quiz }) => ({
        ...state,
        list: addOrChangeQuiz(state.list, quiz),
        details: state.details?.id === quiz.id ? {
            ...state.details,
            id: quiz.id,
            title: quiz.title,
            description: quiz.description
        } : state.details
    })),

    on(QuizzesActions.questionSaved, (state, { question }) => ({
        ...state,
        details: state.details ? {
            ...state.details,
            questions: addOrChangeQuestion(state.details?.questions, question)
        } : null
    })),

    on(QuizzesActions.quizDeleted, (state, { id }) => ({
        ...state,
        details: state.details?.id == id ? null : state.details,
        list: state.list?.filter(q => q.id !== id) ?? null
    })),

    on(QuizzesActions.questionDeleted, (state, { id }) => ({
        ...state,
        details:  state.details ? {
            ...state.details,
            questions: excludeQuestion(state.details.questions, id)
        } : null
    })),

    on(QuizzesActions.questionsReordered, (state, { quizId, questions }) => ({
        ...state,
        details: state.details?.id == quizId ? {
            ...state.details,
            questions: questions
        } : state.details
    }))
    
);

function createDefaultState(): IQuizzesState {
    return {
        loadingCounter: 0,
        list: null,
        details: null
    };
}

function addOrChangeQuiz(list: QuizDto[] | null, quiz: QuizDto): QuizDto[] | null {
    if (list == null) {
        return null;
    }
    const idx = list.findIndex(q => q.id === quiz.id);
    if (idx < 0) {
        return [...list, quiz];
    }
    const result = [...list];
    result.splice(idx, 1, quiz);
    return result;
}

function addOrChangeQuestion(list: QuizQuestionDto[] | undefined, question: QuizQuestionDto): QuizQuestionDto[] {
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
