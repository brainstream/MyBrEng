import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StudentsEventsService, StudentsSelectors, studentsActions } from '../store';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { QuizDto } from '@app/web-api';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-student-add-run-form',
    templateUrl: './student-add-run-form.component.html',
    styleUrls: ['./student-add-run-form.component.scss'],
    standalone: false
})
export class StudentAddRunFormComponent implements OnInit, OnDestroy {
    private createdSubscription: Subscription | null = null;
    private readonly allAvailableQuizzes$: Observable<QuizDto[]>;

    readonly form: FormGroup;
    availableQuizzes$: Observable<QuizDto[]>;
    selectedQuiz?: QuizDto;

    constructor(
        private readonly store$: Store,
        private readonly events: StudentsEventsService,
        private readonly bottomSheet: MatBottomSheetRef,
        formBuilder: FormBuilder,
        @Inject(MAT_BOTTOM_SHEET_DATA) private readonly student: { studentId: string }
    ) {
        this.allAvailableQuizzes$ = store$.select(StudentsSelectors.availableQuizzes);
        this.form = formBuilder.group({
            quiz: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.availableQuizzes$ = combineLatest([
            this.form.controls['quiz'].valueChanges.pipe(startWith('')),
            this.allAvailableQuizzes$
        ])
        .pipe(
            map(([searchString, quizzes]) => {
                if (typeof searchString != 'string') {
                    return quizzes;
                }
                const lowerCaseSearchString = searchString.toLocaleLowerCase();
                return quizzes.filter(q => q.title.toLocaleLowerCase().includes(lowerCaseSearchString));
            })
        );
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

    add(): boolean {
        if (this.form.valid) {
            this.store$.dispatch(studentsActions.addRun({
                run: {
                    quizId: this.form.controls['quiz'].value.id,
                    studentId: this.student.studentId
                }
            }));
        }
        return false;
    }

    cancel(): boolean {
        this.bottomSheet.dismiss();
        return false;
    }
}
