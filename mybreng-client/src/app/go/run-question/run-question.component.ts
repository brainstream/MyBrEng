import { Component, Input } from '@angular/core';
import { RunQuestionDto } from '@app/web-api';

@Component({
  selector: 'app-run-question',
  templateUrl: './run-question.component.html',
  styleUrls: ['./run-question.component.scss']
})
export class RunQuestionComponent {
    @Input() question: RunQuestionDto;

    get type(): 'text' | 'multi' | 'single' {
        switch (this.question.questionType) {
            case RunQuestionDto.QuestionTypeEnum.FreeText:
                return 'text';
            case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'multi';
            default:
                return 'single';
        }
    }
}