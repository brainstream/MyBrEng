import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetailedDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { quizzesActions, QuizzesEventsService, QuizzesSelectors } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { ConfirmDialogButton, ConfirmDialogService, TitleService } from '@app/common';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { MatDialog } from '@angular/material/dialog';
import { QuizQuestionSortComponent } from '../quiz-question-sort';
import { LayoutFullComponent } from '@app/layout';
import { QuizQuestionComponent } from '../quiz-question';
import { QuizQuestionEditFormComponent } from '../quiz-question-edit-form';
import { TagPaneComponent } from '@app/tag';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-quiz-details',
    templateUrl: './quiz-details.component.html',
    styleUrls: ['./quiz-details.component.scss'],
    animations: [
        collapseOnLeaveAnimation()
    ],
    imports: [
        LayoutFullComponent,
        QuizQuestionComponent,
        QuizQuestionEditFormComponent,
        TagPaneComponent,
        AsyncPipe,
        NgFor,
        NgIf,
        MatMenu,
        MatMenuItem,
        MatIcon
    ]
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
    public readonly loading$: Observable<boolean>;
    public quiz: QuizDetailedDto | null;
    public editQuestionId: string | null = null;
    public newQuestion: Partial<QuizQuestionDto> | null = null;
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly store$: Store,
        private readonly bottomSheet: MatBottomSheet,
        private readonly confirmDialog: ConfirmDialogService,
        private readonly dialog: MatDialog,
        private readonly events: QuizzesEventsService,
        private readonly titleService: TitleService
    ) {
        this.loading$ = store$.select(QuizzesSelectors.loading);
    }

    public ngOnInit(): void {
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if(id) {
                this.store$.dispatch(quizzesActions.loadDetails({ id }));
            }
        }));
        this.subscriptions.push(this.store$
            .select(QuizzesSelectors.details)
            .subscribe(quiz => {
                this.quiz = quiz;
                this.titleService.setTitle(quiz?.title);
            }));
        this.subscriptions.push(this.events.quizDeleted$.subscribe(() => {
            this.router.navigate(['/quiz']);
        }));
        this.subscriptions.push(this.events.questionSaved$.subscribe(({ question }) => {
            this.newQuestion = null;
            this.editQuestionId = null;
            this.scrollTo(`question-${question.id}`);
        }));
        this.subscriptions.push(this.events.questionSaved$.subscribe(({ question }) => {
            this.scrollTo(`question-${question.id}`);
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    public editQuiz(): void {
        const quiz = this.quiz;
        if(quiz) {
            this.store$.dispatch(quizzesActions.loadAvailableTags());
            this.bottomSheet.open(QuizEditFormComponent, { data: quiz });
        }
    }

    public async deleteQuiz(): Promise<void> {
        if(!this.quiz) {
            return;
        }
        const result = await this.confirmDialog.show({
            text: 'Вы действительно хотите удалить этот тест?',
            buttons: {
                yes: {
                    text: 'Удалить',
                    icon: 'delete',
                    color: 'warn'
                },
                no: {
                    text: 'Отменить',
                    color: 'default'
                }
            }
        });
        if(result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(quizzesActions.deleteQuiz({ id: this.quiz.id }));
        }
    }

    public addQuestion(): void {
        this.newQuestion = {
            questionType: QuizQuestionDto.QuestionTypeEnum.SingleChoice,
            text: '',
            answers: []
        };
        this.scrollTo('bottom');
    }

    public cloneQuestion(question: QuizQuestionDto | null): void {
        if(question) {
            this.store$.dispatch(quizzesActions.cloneQuestion({ questionId: question.id }));
            this.scrollTo('bottom');
        }
    }

    public scrollTo(id: string): void {
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
    }

    public cancelAddQuestion(): void {
        this.newQuestion = null;
    }

    public saveNewQuestion(question: QuizQuestionEditDto): void {
        this.store$.dispatch(quizzesActions.saveQuestion({ question }));
    }

    public reorderQuestion(): void {
        this.dialog.open(QuizQuestionSortComponent, {
            data: {
                quizId: this.quiz?.id,
                questions: this.quiz?.questions
            }
        });
    }

    public editQuestion(question: QuizQuestionDto | null): void {
        this.editQuestionId = question?.id ?? null;
    }

    public saveQuestion(question: QuizQuestionEditDto): void {
        this.store$.dispatch(quizzesActions.saveQuestion({ question }));
    }

    public async deleteQuestion(question: QuizQuestionDto): Promise<void> {
        const result = await this.confirmDialog.show({
            text: 'Вы действительно хотите удалить вопрос?',
            buttons: {
                yes: {
                    text: 'Удалить',
                    icon: 'delete',
                    color: 'warn'
                },
                no: {
                    text: 'Отменить',
                    color: 'default'
                }
            }
        });
        if(result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(quizzesActions.deleteQuestion({ id: question.id }));
        }
    }
}
