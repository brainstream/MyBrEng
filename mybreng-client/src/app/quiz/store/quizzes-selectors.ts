import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IQuizzesState } from "./quizzes-state";

export namespace QuizzesSelectors {
    const feature = createFeatureSelector<IQuizzesState>('quizzes');
    export const list = createSelector(feature, state => state.list);
    export const loading = createSelector(feature, state => state.loading);
}