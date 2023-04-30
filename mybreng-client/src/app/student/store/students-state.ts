import { StudentDto } from "@app/web-api";

export interface IStudentsState {
    loadingCounter: number,
    list: StudentDto[] | null;
}
