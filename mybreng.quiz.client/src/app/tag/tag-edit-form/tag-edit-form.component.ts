import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { tagsActions, TagsEventsService } from '../store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RGBA } from '@app/shared';

@Component({
    selector: 'app-tag-edit-form',
    standalone: false,
    templateUrl: './tag-edit-form.component.html',
    styleUrl: './tag-edit-form.component.scss'
})
export class TagEditFormComponent implements OnInit, OnDestroy {
    private readonly tagId?: string;
    private subscriptions: Array<Subscription | null> = [];

    form: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: TagsEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) tag?: TagDto
    ) {
        const color = tag
            ?  RGBA.fromInt32(tag.color ?? 0).toRgbaString()
            : 'rgb(189, 189, 189)';
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

    ngOnInit(): void {
        this.subscriptions.push(this.events.tagSaved$.subscribe(() => {
            this.bottomSheet.dismiss();
        }));
        this.subscriptions.push(this.form.controls['color'].valueChanges.subscribe((color) => {
            if (this.form.controls['colorPicker'].valid) {
                this.form.controls['colorPicker'].setValue(color, {
                    emitEvent: false,
                });
            }
        }));
        this.subscriptions.push(this.form.controls['colorPicker'].valueChanges.subscribe(color => {
            this.form.controls['color'].setValue(color, {
                emitEvent: false,
            })
        }));
    }

    ngOnDestroy(): void {
        for (let subscription of this.subscriptions)
            subscription?.unsubscribe();
    }

    cancel(): boolean {
        this.bottomSheet.dismiss();
        return false;
    }

    save(): boolean {
        if (this.form.valid) {
            const color = RGBA.parseRgbaString(this.form.controls['color'].value) ?? new RGBA();
            this.store$.dispatch(tagsActions.saveTag({
                tag: {
                    id: this.tagId,
                    name: this.form.controls['name'].value,
                    color: color.toInt32(),
                    isApplicableForQuizzes: this.form.controls['isApplicableForQuizzes'].value,
                    isApplicableForStudents: this.form.controls['isApplicableForStudents'].value
                }
            }));
            return true;
        }
        return false;
    }
}
