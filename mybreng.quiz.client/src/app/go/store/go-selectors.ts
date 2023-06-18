import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IGoState } from "./go-state";

export namespace GoSelectors {
    const feature = createFeatureSelector<IGoState>('go');
    export const run = createSelector(feature, (state) => state.run)
};
