import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StudentDto, StudentEditDto } from '@app/web-api';

@Component({
  selector: 'app-student-edit-form',
  templateUrl: './student-edit-form.component.html',
  styleUrls: ['./student-edit-form.component.scss']
})
export class StudentEditFormComponent {
    private readonly studentId?: string;

    form: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        @Inject(MAT_BOTTOM_SHEET_DATA) student?: StudentDto

    ) {
        this.studentId = student?.id;
        this.form = formBuilder.group({
            firstName: [student?.firstName ?? '', Validators.required],
            lastName: student?.lastName ?? ''
        });
    }

    cancel() {
        this.bottomSheet.dismiss();
    }

    save() {
        if (this.form.valid) {
            this.bottomSheet.dismiss({
                id: this.studentId,
                firstName: this.form.controls['firstName'].value,
                lastName: this.form.controls['lastName'].value
            } as StudentEditDto);
        }
    }
}
