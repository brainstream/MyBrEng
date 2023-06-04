import { Component, Input } from '@angular/core';
import { IQuizReportItem } from '../quiz-repot';

@Component({
  selector: 'app-quiz-report-item',
  templateUrl: './quiz-report-item.component.html',
  styleUrls: ['./quiz-report-item.component.scss']
})
export class QuizReportItemComponent {
    @Input() data: IQuizReportItem;
}
