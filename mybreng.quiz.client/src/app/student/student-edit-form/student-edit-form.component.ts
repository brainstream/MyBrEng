import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StudentDto, StudentEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { StudentsEventsService, studentsActions } from '../store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-edit-form',
  templateUrl: './student-edit-form.component.html',
  styleUrls: ['./student-edit-form.component.scss']
})
export class StudentEditFormComponent implements OnInit, OnDestroy {
    private readonly studentId?: string;
    private savedSubscription: Subscription | null = null;

    form: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: StudentsEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) student?: StudentDto

    ) {
        this.studentId = student?.id;
        this.form = formBuilder.group({
            firstName: [student?.firstName ?? '', Validators.required],
            lastName: student?.lastName ?? ''
        });
    }

    ngOnInit(): void {
        this.savedSubscription = this.events.studentSaved$.subscribe(() => {
            this.bottomSheet.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.savedSubscription?.unsubscribe();
    }

    cancel() {
        this.bottomSheet.dismiss();
    }

    save() {
        if (this.form.valid) {
            this.store$.dispatch(studentsActions.saveDetails({
                student: {
                    id: this.studentId,
                    firstName: this.form.controls['firstName'].value,
                    lastName: this.form.controls['lastName'].value
                }
            }));
        }
    }
}
