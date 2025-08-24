import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { quizzesActions, QuizzesSelectors, QuizzesEventsService } from '../store';
import { Router } from '@angular/router';
import { TitleService } from '@app/common';
import { IListFilter } from '@app/list-filter';

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.scss'],
    standalone: false
})
export class QuizListComponent implements OnInit, OnDestroy {
    private quizCreatedSubscription: Subscription | undefined;

    readonly quizzes$: Observable<QuizDto[]>;
    readonly loading$: Observable<boolean>;
    readonly filter$: Observable<IListFilter>;
    readonly availableTags$: Observable<TagDto[]>;

    constructor(
        private readonly store$: Store,
        private readonly bottomSheet: MatBottomSheet,
        private readonly events: QuizzesEventsService,
        private readonly router: Router,
        titleService: TitleService
    ) {
        this.quizzes$ = store$.select(QuizzesSelectors.list);
        this.loading$ = store$.select(QuizzesSelectors.loading);
        this.filter$ = store$.select(QuizzesSelectors.listFilter);
        this.availableTags$ = store$.select(QuizzesSelectors.availableTags);
        titleService.setTitle('Тесты');
        store$.dispatch(quizzesActions.loadList());
        store$.dispatch(quizzesActions.loadAvailableTags());
    }

    ngOnInit(): void {
        this.quizCreatedSubscription = this.events.quizSaved$.subscribe(quiz => {
            this.router.navigate(['/quiz', quiz.id]);
        });
    }

    ngOnDestroy(): void {
        this.quizCreatedSubscription?.unsubscribe();
    }

    showCreateQuizForm(): void {
        this.bottomSheet.open(QuizEditFormComponent);
    }

    applyFilter(filter: IListFilter) {
        this.store$.dispatch(quizzesActions.applyFilter({ filter }));
    }
}
