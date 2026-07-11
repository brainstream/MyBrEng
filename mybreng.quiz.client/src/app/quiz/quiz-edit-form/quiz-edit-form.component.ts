import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { QuizDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { quizzesActions, QuizzesEventsService, QuizzesSelectors } from '../store';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-quiz-edit-form',
    templateUrl: './quiz-edit-form.component.html',
    styleUrls: ['./quiz-edit-form.component.scss'],
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
export class QuizEditFormComponent implements OnInit, OnDestroy {
    public readonly quizId?: string;
    public readonly form: FormGroup;
    public readonly availableTags$: Observable<TagDto[]>;
    private savedSubscription: Subscription | null = null;

    constructor(
        fb: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: QuizzesEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) quiz?: QuizDto
    ) {
        this.quizId = quiz?.id;
        const selectedTags = quiz?.tags?.map(t => t.id) ?? [];
        this.form = fb.group({
            title: [quiz?.title ?? '', Validators.required],
            description: [quiz?.description ?? ''],
            tags: [selectedTags],
            tagsFilter: ''
        });
        this.availableTags$ = combineLatest([
            this.store$.select(QuizzesSelectors.availableTags),
            this.form.controls['tagsFilter'].valueChanges.pipe(startWith(''))
        ]).pipe(
            map(([tags, filter]) => {
                const lcFilter = (filter as string || '').toLowerCase();
                return tags.filter(t => t.name.toLowerCase().includes(lcFilter));
            })
        );
    }

    public ngOnInit(): void {
        this.savedSubscription = this.events.quizSaved$.subscribe(() => {
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
            this.store$.dispatch(quizzesActions.saveDetails({
                quiz: {
                    id: this.quizId,
                    title: this.form.controls['title'].value as string,
                    description: this.form.controls['description'].value as string,
                    tags: this.form.controls['tags'].value as string[]
                }
            }));
            return true;
        }
        return false;
    }
}
