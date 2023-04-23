import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizDetailedDto, QuizEditDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { LoadingStatus, QuizzesActions, QuizzesSelectors } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { ConfirmDialogButton, ConfirmDialogService } from '@app/common';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { MatDialog } from '@angular/material/dialog';
import { QuizQuestionSortComponent } from '../quiz-question-sort';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss'],
  animations: [
    collapseOnLeaveAnimation()
  ]
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
  private paramsSubscription: Subscription | undefined;
  private quizSubscription: Subscription | undefined;

  readonly loading$: Observable<boolean>;
  quiz: QuizDetailedDto | null;
  editQuestionId: string | null = null;
  newQuestion: QuizQuestionDto | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store$: Store,
    private readonly bottomSheet: MatBottomSheet,
    private readonly confirmDialog: ConfirmDialogService,
    private readonly dialog: MatDialog
  ) {
    this.loading$ = store$.select(QuizzesSelectors.loading);
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.store$.dispatch(QuizzesActions.loadDetails({ id }))
        }
      });
    this.quizSubscription = this.store$
      .select(QuizzesSelectors.details)
      .subscribe(quiz => this.quiz = quiz);
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    delete this.paramsSubscription;
    this.quizSubscription?.unsubscribe();
    delete this.quizSubscription;
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

  deleteQuiz() {
  }

  addQuestion() {
    this.newQuestion = {
      id: '',
      question_type: QuizQuestionDto.QuestionTypeEnum.SingleChoice,
      text: '',
      answers: []
    };
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      document.querySelector('#bottom')?.scrollIntoView();
    }, 0);
  }

  cancellAddQuestion() {
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
