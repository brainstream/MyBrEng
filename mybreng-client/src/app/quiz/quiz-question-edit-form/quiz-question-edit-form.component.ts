import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Component({
  selector: 'app-quiz-question-edit-form',
  templateUrl: './quiz-question-edit-form.component.html',
  styleUrls: ['./quiz-question-edit-form.component.scss']
})
export class QuizQuestionEditFormComponent {
  @Output() cancelRequested = new EventEmitter<QuizQuestionDto>();
  
  questionType: QuizQuestionDto.TypeEnum | null = null;
  questionText: string | null = null;
  answers: Array<{
    text: string,
    isCorrect: boolean
  }> = [];

  @Input() set question(q: QuizQuestionDto) {
    this.questionType = q.type;
    this.questionText = q.text;
    if (q.answers) {
      this.answers = q.answers.map(a => ({
        isCorrect: a.is_correct,
        text: a.text
      }));
    }
  }

  cancel() {
    this.cancelRequested.emit(this.question);
  }

  get questionTypes(): QuizQuestionDto.TypeEnum[] {
    return Object.values(QuizQuestionDto.TypeEnum);
  }

  get canAnswersBeMarkedAsCorrect(): boolean {
    return this.questionType != QuizQuestionDto.TypeEnum.FreeText;
  }
}
