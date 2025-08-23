import { QuizDto, StudentDetailedDto, StudentDto, TagDto } from "@app/web-api";

export interface IStudentListFilter {
    readonly searchString: string;
    readonly tags: string[];
}

export interface IStudentsState {
    readonly loadingCounter: number,
    readonly list: StudentDto[] | null;
    readonly details: StudentDetailedDto | null;
    readonly availableQuizzes: QuizDto[] | null;
    readonly availableTags: TagDto[] | null;
    readonly listFilter: IStudentListFilter;
}

export function applyListFilter(students: StudentDto[] | null, filter: IStudentListFilter): StudentDto[] {
    if (!students) {
        return [];
    }
    if (!filter.searchString && filter.tags.length == 0) {
        return students;
    }
    const lowerCaseSearchString = filter.searchString.toLocaleLowerCase();

    const isSearchStringMatched = (student: StudentDto) => {
        return student.firstName.toLocaleLowerCase().includes(lowerCaseSearchString) || (
            student.lastName &&
            student.lastName?.toLocaleLowerCase().includes(lowerCaseSearchString)
        )
    };

    const isTagFilterMatched = (student: StudentDto) => {
        return filter.tags.length == 0 ||
            student.tags?.find(tag => filter.tags.includes(tag.id));
    };

    return students.filter(quiz => isSearchStringMatched(quiz) && isTagFilterMatched(quiz));
}
