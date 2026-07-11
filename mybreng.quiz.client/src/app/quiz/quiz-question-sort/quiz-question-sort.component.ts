import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { IQuizQuestionSortData } from './quiz-question-sort-data';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { QuizQuestionPositionDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { quizzesActions, QuizzesEventsService } from '../store';
import { Subscription } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';

interface IQuestionData {
    id: string;
    text: string;
}

@Component({
    selector: 'app-quiz-question-sort',
    templateUrl: './quiz-question-sort.component.html',
    styleUrls: ['./quiz-question-sort.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatDivider,
        MatButton,
        MatIcon,
        DragDropModule,
        NgFor
    ]
})
export class QuizQuestionSortComponent implements OnInit, OnDestroy {
    public readonly questions: IQuestionData[];
    private readonly quizId: string;
    private readonly savedSubscription: Subscription | null = null;

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

    public ngOnInit(): void {
        this.events.questionsReordered$.subscribe(() => {
            this.dialog.close();
        });
    }

    public ngOnDestroy(): void {
        this.savedSubscription?.unsubscribe();
    }

    public drop(event: CdkDragDrop<IQuestionData[]>): void {
        moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
    }

    public save(): void {
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
