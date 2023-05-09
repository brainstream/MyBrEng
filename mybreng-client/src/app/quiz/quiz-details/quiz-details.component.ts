import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetailedDto, QuizEditDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QuizzesActions, QuizzesSelectors } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { ConfirmDialogButton, ConfirmDialogService } from '@app/common';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { MatDialog } from '@angular/material/dialog';
import { QuizQuestionSortComponent } from '../quiz-question-sort';
import { QuizzesEventsService } from '../quizzes-events.service';
import { TitleService } from '@app/common';

@Component({
    selector: 'app-quiz-details',
    templateUrl: './quiz-details.component.html',
    styleUrls: ['./quiz-details.component.scss'],
    animations: [
        collapseOnLeaveAnimation()
    ]
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
                this.store$.dispatch(QuizzesActions.loadDetails({ id }))
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
            // TODO: close the edit form here
            this.scrollTo(`question-${question.id}`);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    editQuiz() {
        const quiz = this.quiz;
        if (!quiz) {
            return;
        }
        const bs = this.bottomSheet
            .open(QuizEditFormComponent, {
                data: quiz,
            });
        const subscription = bs.afterDismissed().subscribe((result: QuizEditDto | undefined) => {
            if (result) {
                this.store$.dispatch(QuizzesActions.saveDetails({
                    quiz: {
                        ...result,
                        id: quiz.id
                    }
                }));
            }
            subscription.unsubscribe();
        });
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
            this.store$.dispatch(QuizzesActions.deleteQuiz({ id: this.quiz.id }));
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

    scrollTo(id: string) {
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView(); // FIXME: use router
        }, 0);
    }

    cancelAddQuestion() {
        this.newQuestion = null;
    }

    saveNewQuestion(question: QuizQuestionEditDto) {
        this.newQuestion = null;
        this.store$.dispatch(QuizzesActions.saveQuestion({ question }));
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
        this.store$.dispatch(QuizzesActions.saveQuestion({ question }));
        this.editQuestionId = null;
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
            this.store$.dispatch(QuizzesActions.deleteQuestion({ id: question.id }));
        }
    }
}
