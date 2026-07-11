import { IArtifactsState } from './artifacts-state';
import { createReducer, on } from '@ngrx/store';
import { artifactsActions } from './artifacts-actions';

export const artifactsReducer = createReducer(
    createDefaultState(),

    on(artifactsActions.setLoading, (state, { loading }) => {
        let loadingCounter: number;
        if(loading) {
            loadingCounter = state.loadingCounter + 1;
        } else {
            loadingCounter = state.loadingCounter <= 0 ? 0 : state.loadingCounter - 1;
        }
        return { ...state, loadingCounter };
    }),

    on(artifactsActions.fileUploaded, (state, { artifact }) => ({
        ...state,
        list: [artifact, ...state.list ?? []]
    })),

    on(artifactsActions.listLoaded, (state, { list }) => ({
        ...state,
        list: [...state.list ?? [], ...list.artifacts ?? []],
        totalCount: list.totalCount
    })),

    on(artifactsActions.fileDeleted, (state, { id }) => ({
        ...state,
        list: state.list?.filter(q => q.id !== id) ?? null
    }))
);

function createDefaultState(): IArtifactsState {
    return {
        loadingCounter: 0,
        list: null,
        totalCount: 0
    };
}
