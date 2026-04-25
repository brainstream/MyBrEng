import {IArtifactsState} from "./artifacts-state";
import {createReducer, on} from "@ngrx/store";
import {artifactsActions} from "./artifacts-actions";

export const artifactsReducer = createReducer(
    createDefaultState(),

    on(artifactsActions.setLoading, (state, { loading }) => ({
        ...state,
        loadingCounter: loading
            ? state.loadingCounter + 1
            : (state.loadingCounter <= 0 ? 0 : state.loadingCounter - 1)
    })),

    on(artifactsActions.fileUploaded, (state, { id }) => ({
        ...state,
        lastUploadedFileId: id
    }))
);

function createDefaultState(): IArtifactsState {
    return {
        loadingCounter: 0,
        lastUploadedFileId: null
    };
}
