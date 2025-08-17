import { createReducer, on } from "@ngrx/store";
import { quizzesActions } from "./quizzes-actions";
import {
    addOrChangeQuestion,
    addOrChangeQuiz,
    createDefaultState,
    excludeQuestion,
    prepareQuizList
} from "./quizzes-state";

export const quizzesReducer = createReducer(
    createDefaultState(),

    on(quizzesActions.setLoading, (state, { loading }) => ({
        ...state,
        loadingCounter: loading
            ? state.loadingCounter + 1
            : (state.loadingCounter <= 0 ? 0 : state.loadingCounter - 1)
    })),

    on(quizzesActions.listLoaded, (state, { quizzes }) => ({
        ...state,
        list: prepareQuizList(quizzes)
    })),

    on(quizzesActions.applyListFilter, (state, { filter }) => ({
        ...state,
        listFilter: filter
    })),

    on(quizzesActions.cleanDetails, (state) => ({
        ...state,
        details: null
    })),

    on(quizzesActions.detailsLoaded, (state, { quiz }) => ({
        ...state,
        details: quiz
    })),

    on(quizzesActions.detailsSaved, (state, { quiz }) => ({
        ...state,
        list: addOrChangeQuiz(state.list, quiz),
        details: state.details?.id === quiz.id ? {
            ...state.details,
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            tags: quiz.tags
        } : state.details
    })),

    on(quizzesActions.questionSaved, (state, { question }) => ({
        ...state,
        details: state.details ? {
            ...state.details,
            questions: addOrChangeQuestion(state.details?.questions, question)
        } : null
    })),

    on(quizzesActions.questionCloned, (state, { question }) => ({
        ...state,
        details: state.details ? {
            ...state.details,
            questions: addOrChangeQuestion(state.details?.questions, question)
        } : null
    })),

    on(quizzesActions.quizDeleted, (state, { id }) => ({
        ...state,
        details: state.details?.id == id ? null : state.details,
        list: state.list?.filter(q => q.id !== id) ?? null
    })),

    on(quizzesActions.questionDeleted, (state, { id }) => ({
        ...state,
        details: state.details ? {
            ...state.details,
            questions: excludeQuestion(state.details.questions, id)
        } : null
    })),

    on(quizzesActions.questionsReordered, (state, { quizId, questions }) => ({
        ...state,
        details: state.details?.id == quizId ? {
            ...state.details,
            questions: questions
        } : state.details
    })),

    on(quizzesActions.availableTagsLoaded, (state, { tags }) => ({
        ...state,
        availableTags: tags
    }))
);

