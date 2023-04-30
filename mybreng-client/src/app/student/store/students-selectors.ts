import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IStudentsState } from "./students-state";

export namespace StudentsSelectors {
    const feature = createFeatureSelector<IStudentsState>('students');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const isListLoaded = createSelector(feature, state => state.list != null);
    export const list = createSelector(feature, state => state.list ?? []);
}
