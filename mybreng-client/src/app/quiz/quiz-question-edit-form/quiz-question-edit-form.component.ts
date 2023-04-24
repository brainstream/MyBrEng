import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';


type Answer = {
  id?: string,
  text: string,
  isCorrect: boolean
};


@Component({
  selector: 'app-quiz-question-edit-form',
  templateUrl: './quiz-question-edit-form.component.html',
  styleUrls: ['./quiz-question-edit-form.component.scss']
})
export class QuizQuestionEditFormComponent {
  private questionId: string | undefined;

  @Output() cancelRequested = new EventEmitter<QuizQuestionDto>();
  @Output() saveRequested = new EventEmitter<QuizQuestionEditDto>();
  
  questionType: QuizQuestionDto.QuestionTypeEnum | null = null;
  questionText: string | null = null;
  answers: Answer[] = [];

  @Input() quizId: string;

  @Input() set question(q: QuizQuestionDto) {
    this.questionType = q.question_type;
    this.questionText = q.text;
    if (q.id !== '') {
      this.questionId = q.id;
    }
    if (q.answers) {
      this.answers = q.answers.map(a => ({
        id: a.id,
        isCorrect: a.is_correct,
        text: a.text
      }));
    }
  }

  save() {
    const questionType = this.questionType ?? QuizQuestionEditDto.QuestionTypeEnum.SingleChoice
    this.saveRequested.emit({
      id: this.questionId,
      quiz_id: this.quizId,
      text: this.questionText ?? '',
      question_type: questionType,
      answers: this.answers.map(a => ({
        id: a.id,
        is_correct: questionType === 'FREE_TEXT' ? true : a.isCorrect,
        text: a.text
      }))
    });
  }

  cancel() {
    this.cancelRequested.emit(this.question);
  }

  addAnswer() {
    this.answers.push({
      text: '',
      isCorrect: false
    })
  }

  deleteAnswer(answer: Answer) {
    const idx = this.answers.indexOf(answer);
    if(idx >= 0) {
      this.answers.splice(idx, 1);
    }
  }

  get questionTypes(): QuizQuestionDto.QuestionTypeEnum[] {
    return Object.values(QuizQuestionDto.QuestionTypeEnum);
  }

  get canAnswersBeMarkedAsCorrect(): boolean {
    return this.questionType != QuizQuestionDto.QuestionTypeEnum.FreeText;
  }
}
