import { IPostponedEvent } from "@app/shared";
import {
    QuizDetailedDto,
    QuizDto,
    QuizEditDto,
    QuizQuestionDto,
    QuizQuestionEditDto,
    QuizQuestionPositionDto
} from "@app/web-api";
import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { IQuizListFilter } from "./quizzes-state";


export const quizzesActions = createActionGroup({
    source: 'Quizzes',
    events: {
        'Set Error': props<{ message: string }>(),
        'Set Loading': props<{ loading: boolean }>(),
        'Flush Events': props<{ events: IPostponedEvent[] }>(),
        'Load List': emptyProps(),
        'List Loaded': props<{ quizzes: QuizDto[] }>(),
        'Apply List Filter': props<{ filter: IQuizListFilter }>(),
        'Load Details': props<{ id: string }>(),
        'Clean Details': emptyProps(),
        'Details Loaded': props<{ quiz: QuizDetailedDto }>(),
        'Save Details': props<{ quiz: QuizEditDto }>(),
        'Details Saved': props<{ quiz: QuizDto }>(),
        'Save Question': props<{ question: QuizQuestionEditDto }>(),
        'Clone Question': props<{ questionId: string }>(),
        'Question Cloned': props<{ question: QuizQuestionDto }>(),
        'Question Saved': props<{ question: QuizQuestionDto }>(),
        'Delete Question': props<{ id: string }>(),
        'Question Deleted': props<{ id: string }>(),
        'Reorder Questions': props<{ quizId: string, questions: QuizQuestionPositionDto[] }>(),
        'Questions Reordered': props<{ quizId: string, questions: QuizQuestionDto[] }>(),
        'Delete Quiz': props<{ id: string }>(),
        'Quiz Deleted': props<{ id: string }>()
    }
});
