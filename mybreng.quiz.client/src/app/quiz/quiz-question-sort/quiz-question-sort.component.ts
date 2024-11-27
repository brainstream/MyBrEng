import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IQuizQuestionSortData } from './quiz-question-sort-data';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { QuizQuestionPositionDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { QuizzesEventsService, quizzesActions } from '../store';
import { Subscription } from 'rxjs';

interface IQuestionData {
    id: string;
    text: string;
}

@Component({
    selector: 'app-quiz-question-sort',
    templateUrl: './quiz-question-sort.component.html',
    styleUrls: ['./quiz-question-sort.component.scss'],
    standalone: false
})
export class QuizQuestionSortComponent implements OnInit, OnDestroy {
    private readonly quizId: string;
    private savedSubscription: Subscription | null = null;

    readonly questions: IQuestionData[];

    constructor(
        @Inject(MAT_DIALOG_DATA) data: IQuizQuestionSortData,
        private readonly dialog: MatDialogRef<QuizQuestionPositionDto[]>,
        private readonly store$: Store,
        private readonly events: QuizzesEventsService
    ) {
        this.quizId = data.quizId;
        this.questions = data.questions.map(q => ({
            id: q.id,
            text: q.text
        }));
    }

    ngOnInit(): void {
        this.events.questionsReordered$.subscribe(() => {
            this.dialog.close();
        });
    }

    ngOnDestroy(): void {
        this.savedSubscription?.unsubscribe();
    }

    drop(event: CdkDragDrop<IQuestionData[]>) {
        moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
    }

    save() {
        const result: QuizQuestionPositionDto[] = this.questions.map((q, idx) => ({
            id: q.id,
            index: idx
        }));
        this.store$.dispatch(quizzesActions.reorderQuestions({
            quizId: this.quizId,
            questions: result
        }));
    }
}
