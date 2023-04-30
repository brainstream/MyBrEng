import { createReducer, on } from "@ngrx/store";
import { IStudentsState } from "./students-state";
import { studentsActions } from "./students-actions";
import { StudentDto } from "@app/web-api";

export const studentsReducer = createReducer(
    createDefaultState(),

    on(studentsActions.setLoading, (state, { loading }) => ({
        ...state,
        loadingCounter: loading
            ? state.loadingCounter + 1
            : (state.loadingCounter <= 0 ? 0 : state.loadingCounter - 1)
    })),

    on(studentsActions.listLoaded, (state, { students }) => ({
        ...state,
        list: prepareStudentList(students)
    })),
);

function createDefaultState(): IStudentsState {
    return {
        loadingCounter: 0,
        list: null
    }
}

function prepareStudentList(students: StudentDto[]): StudentDto[] {
    return sortStudentListInPlace([...students]);
}

function sortStudentListInPlace(list: StudentDto[]): StudentDto[] {
    return list.sort((left, right) => left.firstName < right.firstName ? -1 : 1);
}
