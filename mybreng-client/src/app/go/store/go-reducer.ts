import { createReducer } from "@ngrx/store";
import { IGoState } from "./go-state";

export const goReducer = createReducer(
    createDefaultState()
);

function createDefaultState(): IGoState {
    return {
        loadingCounter: 0,
        run: null
    };
}
