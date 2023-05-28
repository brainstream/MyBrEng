import { Component, Input } from '@angular/core';
import { RunQuestionDto, RunReportAnswerDto } from '@app/web-api';

export interface IRunReportItem {
    question: RunQuestionDto;
    answer: RunReportAnswerDto | null;
}

@Component({
  selector: 'app-quiz-report-item',
  templateUrl: './quiz-report-item.component.html',
  styleUrls: ['./quiz-report-item.component.scss']
})
export class QuizReportItemComponent {
    question: RunQuestionDto;
    answer: RunReportAnswerDto | null;

    @Input() set data(data: IRunReportItem) {
        this.question = data.question;
        this.answer = data.answer;
    }
}
