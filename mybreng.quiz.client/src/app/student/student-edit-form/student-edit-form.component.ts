import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StudentDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { studentsActions, StudentsEventsService, StudentsSelectors } from '../store';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-student-edit-form',
    templateUrl: './student-edit-form.component.html',
    styleUrls: ['./student-edit-form.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatSelect,
        MatOption,
        MatButton,
        MatIcon,
        NgxMatSelectSearchModule,
        AsyncPipe
    ]
})
export class StudentEditFormComponent implements OnInit, OnDestroy {
    public readonly form: FormGroup;
    public readonly availableTags$: Observable<TagDto[]>;
    private readonly studentId?: string;
    private savedSubscription: Subscription | null = null;

    constructor(
        formBuilder: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: StudentsEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) student?: StudentDto
    ) {
        this.studentId = student?.id;
        const selectedTags = student?.tags?.map(t => t.id) ?? [];
        this.form = formBuilder.group({
            firstName: [student?.firstName ?? '', Validators.required],
            lastName: student?.lastName ?? '',
            tags: [selectedTags],
            tagsFilter: ''
        });
        this.availableTags$ = combineLatest([
            this.store$.select(StudentsSelectors.availableTags),
            this.form.controls['tagsFilter'].valueChanges.pipe(startWith(''))
        ]).pipe(
            map(([tags, filter]) => {
                const lcFilter = (filter as string || '').toLowerCase();
                return tags.filter(t => t.name.toLowerCase().includes(lcFilter));
            })
        );
    }

    public ngOnInit(): void {
        this.savedSubscription = this.events.studentSaved$.subscribe(() => {
            this.bottomSheet.dismiss();
        });
    }

    public ngOnDestroy(): void {
        this.savedSubscription?.unsubscribe();
    }

    public cancel(): boolean {
        this.bottomSheet.dismiss();
        return false;
    }

    public save(): boolean {
        if(this.form.valid) {
            this.store$.dispatch(studentsActions.saveDetails({
                student: {
                    id: this.studentId,
                    firstName: this.form.controls['firstName'].value as string,
                    lastName: this.form.controls['lastName'].value as string,
                    tags: this.form.controls['tags'].value as string[]
                }
            }));
            return true;
        }
        return false;
    }
}
