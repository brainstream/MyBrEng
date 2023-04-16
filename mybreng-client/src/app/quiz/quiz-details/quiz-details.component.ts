import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizDetailedDto, QuizEditDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { LoadingStatus, QuizzesActions, QuizzesSelectors } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { QuizEditFormComponent } from '../quiz-edit-form';
import { QuizQuestionEditFormComponent } from '../quiz-question-edit-form';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
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
    private readonly bottomSheet: MatBottomSheet
  ) {
    this.loading$ = store$
      .select(QuizzesSelectors.detailsLoading)
      .pipe(
        map((status) => status === LoadingStatus.Loading)
      );
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.store$.dispatch(QuizzesActions.loadDetails({ id }))
        }
      });
    this.quizSubscription = this.store$.select(QuizzesSelectors.details)
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
            id: quiz.id,
            ...result
          }
        }))
      }
      subscription.unsubscribe();
    });
  }

  deleteQuiz() {
  }

  addQuestion() {
    this.newQuestion = {
      id: '',
      ordinal_number: -1,
      question_type: QuizQuestionDto.QuestionTypeEnum.SingleChoice,
      text: '',
      answers: []
    };
    setTimeout(() => {
      document.querySelector('#new-quiz-question')?.scrollIntoView();
    }, 0);    
  }

  cancellAddQuestion() {
    this.newQuestion = null;
  }

  saveNewQuestion(question: QuizQuestionEditDto) {
    this.newQuestion = null;
    this.store$.dispatch(QuizzesActions.saveQuestion({ question }));
  }

  changeQuestionOrder() {
  }

  editQuestion(question: QuizQuestionDto | null) {
    this.editQuestionId = question?.id ?? null;
  }

  saveQuestion(question: QuizQuestionEditDto) {
    this.store$.dispatch(QuizzesActions.saveQuestion({ question }));
    this.editQuestionId = null;
  }

  deleteQuestion(question: QuizQuestionDto) {

  }
}
