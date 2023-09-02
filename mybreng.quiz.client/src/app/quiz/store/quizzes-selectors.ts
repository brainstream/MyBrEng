import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IQuizzesState, applyListFilter } from "./quizzes-state";

export namespace QuizzesSelectors {
    const feature = createFeatureSelector<IQuizzesState>('quizzes');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const isListLoaded = createSelector(feature, state => state.list != null);
    export const list = createSelector(feature, state => applyListFilter(state.list, state.listFilter));
    export const listFilter = createSelector(feature, state => state.listFilter);
    export const details = createSelector(feature, state => state.details);
}
