import { createFeatureSelector, createSelector } from "@ngrx/store";
import {IArtifactsState} from "@app/artifact/store/artifacts-state";

export namespace ArtifactSelectors {
    const feature = createFeatureSelector<IArtifactsState>('artifacts');
    export const loading = createSelector(feature, state => state.loadingCounter != 0);
    export const lastUploadedFileId = createSelector(feature, state => state.lastUploadedFileId);
}
