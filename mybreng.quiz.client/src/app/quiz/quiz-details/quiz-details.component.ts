import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetailedDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { quizzesActions, QuizzesSelectors, QuizzesEventsService } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { ConfirmDialogButton, ConfirmDialogService } from '@app/common';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { MatDialog } from '@angular/material/dialog';
import { QuizQuestionSortComponent } from '../quiz-question-sort';
import { TitleService } from '@app/common';

@Component({
    selector: 'app-quiz-details',
    templateUrl: './quiz-details.component.html',
    styleUrls: ['./quiz-details.component.scss'],
    animations: [
        collapseOnLeaveAnimation()
    ],
    standalone: false
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    readonly loading$: Observable<boolean>;
    quiz: QuizDetailedDto | null;
    editQuestionId: string | null = null;
    newQuestion: Partial<QuizQuestionDto> | null = null;

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

    ngOnInit(): void {
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.store$.dispatch(quizzesActions.loadDetails({ id }))
            }
        })
        );
        this.subscriptions.push(this.store$
            .select(QuizzesSelectors.details)
            .subscribe(quiz => {
                this.quiz = quiz;
                this.titleService.setTitle(quiz?.title);
            })
        );
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    editQuiz() {
        const quiz = this.quiz;
        if (quiz) {
            this.bottomSheet.open(QuizEditFormComponent, { data: quiz });
        }
    }

    async deleteQuiz() {
        if (!this.quiz) {
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
        if (result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(quizzesActions.deleteQuiz({ id: this.quiz.id }));
        }
    }

    addQuestion() {
        this.newQuestion = {
            questionType: QuizQuestionDto.QuestionTypeEnum.SingleChoice,
            text: '',
            answers: []
        };
        this.scrollTo('bottom');
    }

    cloneQuestion(question: QuizQuestionDto | null) {
        if (question) {
            this.store$.dispatch(quizzesActions.cloneQuestion({ questionId: question.id }))
            this.scrollTo('bottom');
        }
    }

    scrollTo(id: string) {
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
    }

    cancelAddQuestion() {
        this.newQuestion = null;
    }

    saveNewQuestion(question: QuizQuestionEditDto) {
        this.store$.dispatch(quizzesActions.saveQuestion({ question }));
    }

    reorderQuestion() {
        this.dialog.open(QuizQuestionSortComponent, {
            data: {
                quizId: this.quiz?.id,
                questions: this.quiz?.questions
            }
        });
    }

    editQuestion(question: QuizQuestionDto | null) {
        this.editQuestionId = question?.id ?? null;
    }

    saveQuestion(question: QuizQuestionEditDto) {
        this.store$.dispatch(quizzesActions.saveQuestion({ question }));
    }

    async deleteQuestion(question: QuizQuestionDto) {
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
        if (result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(quizzesActions.deleteQuestion({ id: question.id }));
        }
    }
}
