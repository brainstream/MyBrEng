import { QuizDto, StudentDetailedDto, StudentDto } from "@app/web-api";

export interface IStudentsState {
    loadingCounter: number,
    list: StudentDto[] | null;
    details: StudentDetailedDto | null;
    availableQuizzes: QuizDto[] | null;
}
