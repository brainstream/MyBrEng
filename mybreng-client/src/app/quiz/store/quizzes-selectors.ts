import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IQuizzesState } from "./quizzes-state";

export namespace QuizzesSelectors {
    const feature = createFeatureSelector<IQuizzesState>('quizzes');
    export const list = createSelector(feature, state => state.list.data);
    export const listLoading = createSelector(feature, state => state.list.loading);
    export const details = createSelector(feature, state => state.details.data);
    export const detailsLoading = createSelector(feature, state => state.details.loading);
}
