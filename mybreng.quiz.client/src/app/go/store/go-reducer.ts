import { createReducer, on } from "@ngrx/store";
import { IGoState } from "./go-state";
import { goActions } from "./go-actions";

export const goReducer = createReducer(
    createDefaultState(),
    on(goActions.loaded, (state, { run }) => ({ ...state, run }))
);

function createDefaultState(): IGoState {
    return {
        loadingCounter: 0,
        run: null
    };
}
