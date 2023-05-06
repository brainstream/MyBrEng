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

    on(studentsActions.detailsLoaded, (state, { student }) => ({
        ...state,
        details: student
    })),

    on(studentsActions.detailsSaved, (state, { student }) => ({
        ...state,
        list: addOrChangeStudent(state.list, student),
        details: state.details?.id === student.id ? {
            ...state.details,
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName
        } : state.details
    }))
);

function createDefaultState(): IStudentsState {
    return {
        loadingCounter: 0,
        list: null,
        details: null
    };
}

function prepareStudentList(students: StudentDto[]): StudentDto[] {
    return sortStudentListInPlace([...students]);
}

function sortStudentListInPlace(list: StudentDto[]): StudentDto[] {
    return list.sort((left, right) => left.firstName < right.firstName ? -1 : 1);
}

function addOrChangeStudent(list: StudentDto[] | null, student: StudentDto): StudentDto[] | null {
    if (list == null) {
        return null;
    }
    const idx = list.findIndex(s => s.id === student.id);
    if (idx < 0) {
        return [...list, student];
    }
    const result = [...list];
    result.splice(idx, 1, student);
    return sortStudentListInPlace(result);
}
