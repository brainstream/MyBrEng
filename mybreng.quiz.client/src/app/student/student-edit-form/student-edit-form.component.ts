import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StudentDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { StudentsEventsService, StudentsSelectors, studentsActions } from '../store';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-student-edit-form',
    templateUrl: './student-edit-form.component.html',
    styleUrls: ['./student-edit-form.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, NgxMatSelectSearchModule, AsyncPipe]
})
export class StudentEditFormComponent implements OnInit, OnDestroy {
    private readonly studentId?: string;
    private savedSubscription: Subscription | null = null;

    readonly form: FormGroup;
    readonly availableTags$: Observable<TagDto[]>;

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

    ngOnInit(): void {
        this.savedSubscription = this.events.studentSaved$.subscribe(() => {
            this.bottomSheet.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.savedSubscription?.unsubscribe();
    }

    cancel(): boolean {
        this.bottomSheet.dismiss();
        return false;
    }

    save(): boolean {
        if (this.form.valid) {
            this.store$.dispatch(studentsActions.saveDetails({
                student: {
                    id: this.studentId,
                    firstName: this.form.controls['firstName'].value,
                    lastName: this.form.controls['lastName'].value,
                    tags: this.form.controls['tags'].value
                }
            }));
            return true;
        }
        return false;
    }
}
