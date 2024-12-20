import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { quizzesActions, QuizzesSelectors, QuizzesEventsService, IQuizListFilter } from '../store';
import { Router } from '@angular/router';
import { TitleService } from '@app/common';

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
    readonly filter$: Observable<IQuizListFilter>;

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
        titleService.setTitle('Тесты');
        store$.dispatch(quizzesActions.loadList());
    }

    ngOnInit(): void {
        this.quizCreatedSubscription = this.events.quizSaved$.subscribe(quiz => {
            this.router.navigate(['/quiz', quiz.id]);
        });
    }

    ngOnDestroy(): void {
        this.quizCreatedSubscription?.unsubscribe();
    }

    showCreateQuizForm() {
        this.bottomSheet.open(QuizEditFormComponent);
    }

    applySearchString(searchString: string) {
        this.store$.dispatch(quizzesActions.applyListFilter({
            filter: {
                searchString
            }
        }))
    }
}
