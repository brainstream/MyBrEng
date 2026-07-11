import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { quizzesActions, QuizzesEventsService, QuizzesSelectors } from '../store';
import { Router } from '@angular/router';
import { TitleService } from '@app/common';
import { IListFilter, ListFilterPanelComponent } from '@app/list-filter';
import { LayoutFullComponent } from '@app/layout';
import { QuizListItemComponent } from '../quiz-list-item';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.scss'],
    imports: [
        LayoutFullComponent,
        QuizListItemComponent,
        ListFilterPanelComponent,
        AsyncPipe,
        NgFor,
        MatNavList,
        MatMenu,
        MatMenuItem,
        MatIcon
    ]
})
export class QuizListComponent implements OnInit, OnDestroy {
    public readonly quizzes$: Observable<QuizDto[]>;
    public readonly loading$: Observable<boolean>;
    public readonly filter$: Observable<IListFilter>;
    public readonly availableTags$: Observable<TagDto[]>;
    private quizCreatedSubscription: Subscription | undefined;

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

    public ngOnInit(): void {
        this.quizCreatedSubscription = this.events.quizSaved$.subscribe(quiz => {
            this.router.navigate(['/quiz', quiz.id]);
        });
    }

    public ngOnDestroy(): void {
        this.quizCreatedSubscription?.unsubscribe();
    }

    public showCreateQuizForm(): void {
        this.bottomSheet.open(QuizEditFormComponent);
    }

    public applyFilter(filter: IListFilter): void {
        this.store$.dispatch(quizzesActions.applyFilter({ filter }));
    }
}
