import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { QuizEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { QuizzesEventsService, quizzesActions } from '../store';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-quiz-edit-form',
    templateUrl: './quiz-edit-form.component.html',
    styleUrls: ['./quiz-edit-form.component.scss']
})
export class QuizEditFormComponent implements OnInit, OnDestroy {
    private savedSubscripion: Subscription | null = null;

    readonly quizId?: string;
    readonly form: FormGroup;

    constructor(
        fb: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: QuizzesEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) quiz?: QuizEditDto,
    ) {
        this.quizId = quiz?.id;
        this.form = fb.group({
            title: [quiz?.title ?? '', Validators.required],
            description: [quiz?.description ?? '']
        });
    }

    ngOnInit(): void {
        this.savedSubscripion = this.events.quizSaved$.subscribe(() => {
            this.bottomSheet.dismiss();
        });
    }

    ngOnDestroy(): void {
        this.savedSubscripion?.unsubscribe();
    }

    cancel() {
        this.bottomSheet.dismiss();
    }

    save() {
        if (this.form.valid) {
            this.store$.dispatch(quizzesActions.saveDetails({
                quiz: {
                    id: this.quizId,
                    title: this.form.controls['title'].value,
                    description: this.form.controls['description'].value
                }
            }));
        }
    }
}
