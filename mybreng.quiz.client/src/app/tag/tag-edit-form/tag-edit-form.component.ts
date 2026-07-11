import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { tagsActions, TagsEventsService } from '../store';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RGBA } from '@app/shared';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgxColorsModule } from 'ngx-colors';

@Component({
    selector: 'app-tag-edit-form',
    templateUrl: './tag-edit-form.component.html',
    styleUrl: './tag-edit-form.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatCheckbox,
        MatSuffix,
        MatButton,
        MatIcon,
        NgxColorsModule
    ]
})
export class TagEditFormComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    private readonly tagId?: string;
    private readonly subscriptions: Array<Subscription | null> = [];

    constructor(
        formBuilder: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: TagsEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) tag?: TagDto
    ) {
        const color = tag ?
            RGBA.fromInt32(tag.color ?? 0).toRgbaString() :
            'rgb(189, 189, 189)';
        this.tagId = tag?.id;
        this.form = formBuilder.group({
            name: [tag?.name ?? '', Validators.required],
            colorPicker: [color],
            color: [color, Validators.required],
            isApplicableForQuizzes: [tag?.isApplicableForQuizzes ?? true],
            isApplicableForStudents: [tag?.isApplicableForStudents ?? true]
        }, {
            updateOn: 'change'
        });
    }

    public ngOnInit(): void {
        this.subscriptions.push(this.events.tagSaved$.subscribe(() => {
            this.bottomSheet.dismiss();
        }));
        this.subscriptions.push(this.form.controls['color'].valueChanges.subscribe(color => {
            if(this.form.controls['colorPicker'].valid) {
                this.form.controls['colorPicker'].setValue(color, {
                    emitEvent: false
                });
            }
        }));
        this.subscriptions.push(this.form.controls['colorPicker'].valueChanges.subscribe(color => {
            this.form.controls['color'].setValue(color, {
                emitEvent: false
            });
        }));
    }

    public ngOnDestroy(): void {
        for(const subscription of this.subscriptions) {
            subscription?.unsubscribe();
        }
    }

    public cancel(): boolean {
        this.bottomSheet.dismiss();
        return false;
    }

    public save(): boolean {
        if(this.form.valid) {
            const color = RGBA.parseRgbaString(this.form.controls['color'].value as string) ?? new RGBA();
            this.store$.dispatch(tagsActions.saveTag({
                tag: {
                    id: this.tagId,
                    name: this.form.controls['name'].value as string,
                    color: color.toInt32(),
                    isApplicableForQuizzes: this.form.controls['isApplicableForQuizzes'].value as boolean,
                    isApplicableForStudents: this.form.controls['isApplicableForStudents'].value as boolean
                }
            }));
            return true;
        }
        return false;
    }
}
