import { createReducer, on } from "@ngrx/store";
import { IStudentsState } from "./students-state";
import { studentsActions } from "./students-actions";
import { RunSummaryDto, StudentDetailedDto, StudentDto } from "@app/web-api";

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

    on(studentsActions.cleanDetails, (state) => ({
        ...state,
        details: null
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
            lastName: student.lastName,
            tags: student.tags
        } : state.details
    })),

    on(studentsActions.availableQuizzesLoaded, (state, { quizzes }) => ({
        ...state,
        availableQuizzes: quizzes
    })),

    on(studentsActions.runAdded, (state, { run }) => ({
        ...state,
        details: addRun(state.details, run)
    })),

    on(studentsActions.runDeleted, (state, { id }) => ({
        ...state,
        details: deleteRun(state.details, id)
    })),

    on(studentsActions.studentDeleted, (state, { id }) => ({
        ...state,
        details: state.details?.id == id ? null : state.details,
        list: state.list?.filter(q => q.id !== id) ?? null
    })),

    on(studentsActions.noteSaved, (state, { dto: { studentId, note } }) => ({
        ...state,
        details: state.details?.id === studentId ? {
            ...state.details,
            note
        } : state.details
    })),

    on(studentsActions.availableTagsLoaded, (state, { tags }) => ({
        ...state,
        availableTags: tags
    })),

    on(studentsActions.applySearchString, (state, { searchString }) => ({
        ...state,
        listFilter: {
            ...state.listFilter,
            searchString
        }
    })),

    on(studentsActions.applyTagFilter, (state, { tags }) => ({
        ...state,
        listFilter: {
            ...state.listFilter,
            tags
        }
    }))
);

function createDefaultState(): IStudentsState {
    return {
        loadingCounter: 0,
        list: null,
        details: null,
        availableQuizzes: null,
        availableTags: null,
        listFilter: {
            searchString: '',
            tags: []
        }
    };
}

function prepareStudentList(students: StudentDto[]): StudentDto[] {
    return sortStudentListInPlace([...students]);
}

function sortStudentListInPlace(list: StudentDto[]): StudentDto[] {
    return list.sort((left, right) => left.firstName.toLowerCase() < right.firstName.toLowerCase() ? -1 : 1);
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

function addRun(student: StudentDetailedDto | null, run: RunSummaryDto): StudentDetailedDto | null {
    if (student == null || student.runs === undefined) {
        return student;
    }
    return {
        ...student,
        runs: [run, ...student.runs]
    };
}

function deleteRun(student: StudentDetailedDto | null, id: string): StudentDetailedDto | null {
    if (student == null || student.runs === undefined) {
        return student;
    }
    const idx = student.runs.findIndex(r => r.id === id);
    let runs: RunSummaryDto[];
    if (idx >= 0) {
        runs = [...student.runs];
        runs.splice(idx, 1);
    } else {
        runs = student.runs;
    }
    return {
        ...student,
        runs
    };
}
