import { QuizDto, StudentDetailedDto, StudentDto, TagDto } from "@app/web-api";

export interface IStudentsState {
    loadingCounter: number,
    list: StudentDto[] | null;
    details: StudentDetailedDto | null;
    availableQuizzes: QuizDto[] | null;
    availableTags: TagDto[] | null;
}
