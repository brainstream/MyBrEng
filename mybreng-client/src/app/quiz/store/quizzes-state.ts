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
    readonly list: RemoteData<QuizDto[]>;
    readonly details: RemoteData<QuizDetailedDto | null>;
}
