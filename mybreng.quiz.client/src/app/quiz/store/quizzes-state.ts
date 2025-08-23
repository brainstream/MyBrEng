import { QuizDto, QuizDetailedDto, QuizQuestionDto, TagDto } from "@app/web-api";

export interface IQuizListFilter {
    readonly searchString: string;
    readonly tags: string[];
}

export interface IQuizzesState {
    readonly loadingCounter: number;
    readonly list: QuizDto[] | null;
    readonly listFilter: IQuizListFilter;
    readonly details: QuizDetailedDto | null;
    readonly availableTags: TagDto[] | null;
}

export function createDefaultState(): IQuizzesState {
    return {
        loadingCounter: 0,
        list: null,
        details: null,
        listFilter: {
            searchString: '',
            tags: []
        },
        availableTags: null
    };
}

export function prepareQuizList(list: QuizDto[]): QuizDto[] {
    return sortQuizListInPlace([...list]);
}

export function sortQuizListInPlace(list: QuizDto[]): QuizDto[] {
    return list.sort((left, right) => left.title < right.title ? -1 : 1);
}

export function addOrChangeQuiz(list: QuizDto[] | null, quiz: QuizDto): QuizDto[] | null {
    if (list == null) {
        return null;
    }
    const idx = list.findIndex(q => q.id === quiz.id);
    if (idx < 0) {
        return [...list, quiz];
    }
    const result = [...list];
    result.splice(idx, 1, quiz);
    return sortQuizListInPlace(result);
}

export function applyListFilter(quizzes: QuizDto[] | null, filter: IQuizListFilter): QuizDto[] {
    if (!quizzes) {
        return [];
    }
    if (!filter.searchString && filter.tags.length == 0) {
        return quizzes;
    }
    const lowerCaseSearchString = filter.searchString.toLocaleLowerCase();

    const isSearchStringMatched = (quiz: QuizDto) => {
        return quiz.title.toLocaleLowerCase().includes(lowerCaseSearchString) || (
            quiz.description &&
            quiz.description?.toLocaleLowerCase().includes(lowerCaseSearchString)
        )
    };

    const isTagFilterMatched = (quiz: QuizDto) => {
        return filter.tags.length == 0 ||
            quiz.tags?.find(tag => filter.tags.includes(tag.id));
    };

    return quizzes.filter(quiz => isSearchStringMatched(quiz) && isTagFilterMatched(quiz));
}

export function addOrChangeQuestion(
    list: QuizQuestionDto[] | undefined,
    question: QuizQuestionDto
): QuizQuestionDto[] {
    if (list === undefined) {
        return [question];
    }
    const idx = list.findIndex(q => q.id === question.id);
    if (idx < 0) {
        return [...list, question];
    } else {
        const result = [...list];
        result.splice(idx, 1, question);
        return result;
    }
}

export function excludeQuestion(
    list: QuizQuestionDto[] | undefined,
    id: string
): QuizQuestionDto[] | undefined {
    if (list === undefined) {
        return undefined;
    }
    let result = list;
    const idx = result.findIndex(q => q.id === id);
    if (idx >= 0) {
        result = [...result];
        result.splice(idx, 1);
    }
    return result;
}
