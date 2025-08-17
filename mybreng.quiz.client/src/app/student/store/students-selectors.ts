import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IStudentsState } from "./students-state";

export namespace StudentsSelectors {
    const feature = createFeatureSelector<IStudentsState>('students');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const isListLoaded = createSelector(feature, state => state.list != null);
    export const list = createSelector(feature, state => state.list ?? []);
    export const details = createSelector(feature, state => state.details);
    export const isAvailableQuizzesLoaded = createSelector(feature, state => state.availableQuizzes != null);
    export const availableQuizzes = createSelector(feature, state => state.availableQuizzes ?? []);
    export const availableTags = createSelector(feature, state => state.availableTags ?? []);
}
