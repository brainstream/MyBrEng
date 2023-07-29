import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StudentsEventsService, StudentsSelectors, studentsActions } from '../store';
import { Observable, Subscription } from 'rxjs';
import { QuizDto } from '@app/web-api';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-student-add-run-form',
    templateUrl: './student-add-run-form.component.html',
    styleUrls: ['./student-add-run-form.component.scss']
})
export class StudentAddRunFormComponent implements OnInit, OnDestroy {
    private createdSubscription: Subscription | null = null;

    readonly availableQuizzes$: Observable<QuizDto[]>;
    selectedQuiz?: QuizDto;

    constructor(
        private readonly store$: Store,
        private readonly events: StudentsEventsService,
        private readonly bottomSheet: MatBottomSheetRef,
        @Inject(MAT_BOTTOM_SHEET_DATA) private readonly student: { studentId: string }
    ) {
        this.availableQuizzes$ = store$.select(StudentsSelectors.availableQuizzes);
    }

    ngOnInit(): void {
        this.store$.dispatch(studentsActions.loadAvailableQuizzes());
        this.createdSubscription = this.events.runCreated$.subscribe(() => {
            this.bottomSheet.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.createdSubscription?.unsubscribe();
    }

    getQuizTitle(quiz?: QuizDto): string {
        return quiz?.title ?? '';
    }

    get valid(): boolean {
        return this.selectedQuiz != undefined;
    }

    add(): void {
        if (this.selectedQuiz) {
            this.store$.dispatch(studentsActions.addRun({
                run: {
                    quizId: this.selectedQuiz.id,
                    studentId: this.student.studentId
                }
            }));
        }
    }

    cancel(): void {
        this.bottomSheet.dismiss();
    }
}
