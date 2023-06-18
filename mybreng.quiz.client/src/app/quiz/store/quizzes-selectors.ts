import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IQuizzesState } from "./quizzes-state";

export namespace QuizzesSelectors {
    const feature = createFeatureSelector<IQuizzesState>('quizzes');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const isListLoaded = createSelector(feature, state => state.list != null);
    export const list = createSelector(feature, state => state.list ?? []);
    export const details = createSelector(feature, state => state.details);
}
