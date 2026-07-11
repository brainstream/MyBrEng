import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { studentsActions, StudentsEventsService, StudentsSelectors } from '../store';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { QuizDto } from '@app/web-api';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-student-add-run-form',
    templateUrl: './student-add-run-form.component.html',
    styleUrls: ['./student-add-run-form.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatOption,
        MatButton,
        MatIcon,
        AsyncPipe
    ]
})
export class StudentAddRunFormComponent implements OnInit, OnDestroy {
    public readonly form: FormGroup;
    public availableQuizzes$: Observable<QuizDto[]>;
    public selectedQuiz?: QuizDto;
    private createdSubscription: Subscription | null = null;
    private readonly allAvailableQuizzes$: Observable<QuizDto[]>;

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

    public ngOnInit(): void {
        this.availableQuizzes$ = combineLatest([
            this.form.controls['quiz'].valueChanges.pipe(startWith('')),
            this.allAvailableQuizzes$
        ])
            .pipe(
                map(([searchString, quizzes]) => {
                    if(typeof searchString !== 'string') {
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

    public ngOnDestroy(): void {
        this.createdSubscription?.unsubscribe();
    }

    public getQuizTitle(quiz?: QuizDto): string {
        return quiz?.title ?? '';
    }

    public add(): boolean {
        if(this.form.valid) {
            this.store$.dispatch(studentsActions.addRun({
                run: {
                    quizId: (this.form.controls['quiz'].value as QuizDto).id,
                    studentId: this.student.studentId
                }
            }));
        }
        return false;
    }

    public cancel(): boolean {
        this.bottomSheet.dismiss();
        return false;
    }
}
