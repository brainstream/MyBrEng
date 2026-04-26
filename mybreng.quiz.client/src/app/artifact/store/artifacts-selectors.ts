import { createFeatureSelector, createSelector } from "@ngrx/store";
import {IArtifactsState} from "@app/artifact/store/artifacts-state";

export namespace ArtifactSelectors {
    const feature = createFeatureSelector<IArtifactsState>('artifacts');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const list = createSelector(feature, state => state.list ?? []);
    export const isListLoaded = createSelector(feature, state => state.list != null);
    export const hasMore = createSelector(feature, state => state.list != null && state.list.length < state.totalCount);
}
