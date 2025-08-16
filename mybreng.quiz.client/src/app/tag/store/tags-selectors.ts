import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ITagsState } from "./tags-state";

export namespace TagsSelectors {
    const feature = createFeatureSelector<ITagsState>('tags');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const isListLoaded = createSelector(feature, state => state.list != null);
    export const list = createSelector(feature, state => state.list ?? []);
}
