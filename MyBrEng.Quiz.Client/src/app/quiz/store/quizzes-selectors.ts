import { createFeatureSelector } from "@ngrx/store";

export namespace QuizzesSelectors {
    const state = createFeatureSelector('quizzes');
}