import { 
    QuizDetailedDto,
    QuizDto, 
    QuizEditDto, 
    QuizQuestionDto, 
    QuizQuestionEditDto 
} from "@app/web-api";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export type QuizSaveResult = QuizEditDto | { id?: string, error: true };
export type QuizQuestionSaveResult = QuizQuestionDto | { id?: string, error: true };
export type QuizQuestionDeletionResult = { id: string, error?: true };

export const QuizzesActions = createActionGroup({
    source: 'Quizzes',
    events: {
        'Load List': emptyProps(),
        'Start List Loading': emptyProps(),
        'Finish List Loading': props<{ result: QuizDto[] | 'error' }>(),
        'Load Details': props<{ id: string }>(),
        'Start Details Loading': emptyProps(),
        'Finish Details Loading': props<{ result: QuizDetailedDto | 'error' }>(),
        'Save Details': props<{ quiz: QuizEditDto }>(),
        'Start Details Saving': props<{ id?: string }>(),
        'Finish Details Saving': props<{ result: QuizSaveResult }>(),
        'Save Question': props<{ question: QuizQuestionEditDto }>(),
        'Start Question Saving': props<{ id?: string }>(),
        'Finish Question Saving': props<{ result: QuizQuestionSaveResult }>(),
        'Delete Question': props<{ id: string }>(),
        'Start Question Deletion': props<{ id: string }>(),
        'Finish Question Deletion': props<{ result: QuizQuestionDeletionResult }>()
    }
});
