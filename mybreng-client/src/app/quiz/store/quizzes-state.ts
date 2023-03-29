import { QuizDto } from "@app/web-api";

export interface IQuizzesState {
    readonly list: QuizDto[];
}
