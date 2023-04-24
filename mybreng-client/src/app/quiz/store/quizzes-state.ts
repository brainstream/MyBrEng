import { QuizDto, QuizDetailedDto } from "@app/web-api";

export const enum LoadingStatus {
    None,
    Loading,
    Loaded,
    Error
}

export class RemoteData<T> {
    constructor(
        public readonly data: T, 
        public readonly loading: LoadingStatus
    ) {
    }
}

export interface IQuizzesState {
    readonly loadingCounter: number;
    readonly list: QuizDto[] | null;
    readonly details: QuizDetailedDto | null;
}
