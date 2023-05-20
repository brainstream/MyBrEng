import { Component, Input } from '@angular/core';
import { RunQuestionDto } from '@app/web-api';

@Component({
  selector: 'app-run-question',
  templateUrl: './run-question.component.html',
  styleUrls: ['./run-question.component.scss']
})
export class RunQuestionComponent {
    @Input() question: RunQuestionDto;
}
