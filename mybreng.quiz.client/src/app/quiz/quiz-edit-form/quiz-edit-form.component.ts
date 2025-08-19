import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { QuizDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { QuizzesEventsService, QuizzesSelectors, quizzesActions } from '../store';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';

@Component({
    selector: 'app-quiz-edit-form',
    templateUrl: './quiz-edit-form.component.html',
    styleUrls: ['./quiz-edit-form.component.scss'],
    standalone: false
})
export class QuizEditFormComponent implements OnInit, OnDestroy {
    private savedSubscription: Subscription | null = null;

    readonly quizId?: string;
    readonly form: FormGroup;
    readonly availableTags$: Observable<TagDto[]>;

    constructor(
        fb: FormBuilder,
        private readonly bottomSheet: MatBottomSheetRef,
        private readonly store$: Store,
        private readonly events: QuizzesEventsService,
        @Inject(MAT_BOTTOM_SHEET_DATA) quiz?: QuizDto,
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

    ngOnInit(): void {
        this.savedSubscription = this.events.quizSaved$.subscribe(() => {
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
            this.store$.dispatch(quizzesActions.saveDetails({
                quiz: {
                    id: this.quizId,
                    title: this.form.controls['title'].value,
                    description: this.form.controls['description'].value,
                    tags: this.form.controls['tags'].value
                }
            }));
            return true;
        }
        return false;
    }
}
