import { 
    QuizDetailedDto,
    QuizDto, 
    QuizEditDto, 
    QuizQuestionDto, 
    QuizQuestionEditDto 
} from "@app/web-api";
import { createAction, props } from "@ngrx/store";


export type QuizSaveResult = QuizEditDto | { id?: string, error: true };
export type QuizQuestionSaveResult = QuizQuestionDto | { id?: string, error: true };


export namespace QuizzesActions {
    export const loadList = createAction(
        '[Quizzes] Load List'
    );
    export const startListLoading = createAction(
        '[Quizzes] Start List Loading'
    );
    export const finishListLoading = createAction(
        '[Quizzes] Finish List Loading',
        props<{ result: QuizDto[] | 'error' }>()
    );
    export const loadDetails = createAction(
        '[Quizzes] Load Details',
        props<{ id: string }>()
    );
    export const startDetailsLoading = createAction(
        '[Quizzes] Start Details Loading'
    );
    export const finishDetailsLoading = createAction(
        '[Quizzes] Finish Details Loading',
        props<{ result: QuizDetailedDto | 'error' }>()
    );
    export const saveDetails = createAction(
        '[Quizzes] Save Details',
        props<{ quiz: QuizEditDto }>()
    );
    export const startDetailsSaving = createAction(
        '[Quizzes] Start Details Saving',
        props<{ id?: string }>()
    );

    export const finishDetailsSaving = createAction(
        '[Quizzes] Finish Details Saving',
        props<{ result: QuizSaveResult }>()
    );
    export const saveQuestion = createAction(
        '[Quizzes] Save Question',
        props<{ question: QuizQuestionEditDto }>()
    );
    export const startQuestionSaving = createAction(
        '[Quizzes] Start Question Saving',
        props<{ id?: string }>()
    );
    export const finishQuestionSaving = createAction(
        '[Quizzes] Finish Question Saving',
        props<{ result: QuizQuestionSaveResult }>()
    );
}