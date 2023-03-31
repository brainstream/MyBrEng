import { QuizDto } from "@app/web-api";

export const enum LoadingStatus {
    None,
    Loading,
    Loaded,
    Error
}

export interface IQuizzesState {
    readonly list: QuizDto[];
    readonly loading: LoadingStatus;
}
