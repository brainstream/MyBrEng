import { QuizQuestionDto } from "@app/web-api";

export interface IQuizQuestionSortData {
    quizId: string,
    questions: QuizQuestionDto[];
}