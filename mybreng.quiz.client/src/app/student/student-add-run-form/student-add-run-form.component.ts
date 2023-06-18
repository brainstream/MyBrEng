import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StudentsSelectors, studentsActions } from '../store';
import { Observable } from 'rxjs';
import { QuizDto } from '@app/web-api';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-student-add-run-form',
    templateUrl: './student-add-run-form.component.html',
    styleUrls: ['./student-add-run-form.component.scss']
})
export class StudentAddRunFormComponent implements OnInit {
    readonly availableQuizzes$: Observable<QuizDto[]>;
    selectedQuiz?: QuizDto;

    constructor(
        private readonly store$: Store,
        private readonly bottomSheet: MatBottomSheetRef,
    ) {
        this.availableQuizzes$ = store$.select(StudentsSelectors.availableQuizzes);
    }

    ngOnInit(): void {
        this.store$.dispatch(studentsActions.loadAvailableQuizzes());
    }

    getQuizTitle(quiz?: QuizDto): string {
        return quiz?.title ?? '';
    }

    get valid(): boolean {
        return this.selectedQuiz != undefined;
    }

    add(): void {
        this.bottomSheet.dismiss(this.selectedQuiz);
    }

    cancel(): void {
        this.bottomSheet.dismiss();
    }
}
