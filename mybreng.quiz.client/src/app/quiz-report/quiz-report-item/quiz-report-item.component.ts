import { Component, Input } from '@angular/core';
import { IQuizReportItem } from '../quiz-report';
import { RunQuestionDto } from '@app/web-api';

@Component({
    selector: 'app-quiz-report-item',
    templateUrl: './quiz-report-item.component.html',
    styleUrls: ['./quiz-report-item.component.scss'],
    host: {
        'class': 'quiz-report-item'
    },
    standalone: false
})
export class QuizReportItemComponent {
    @Input() data: IQuizReportItem;
    @Input() index: number;

    get questionDescription(): string {
        switch (this.data.questionType) {
            case RunQuestionDto.QuestionTypeEnum.FreeText:
                return 'Вписать ответ';
            case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'Выбрать все правильные ответы';
            case RunQuestionDto.QuestionTypeEnum.SingleChoice:
                return 'Выбрать любой правильный ответ';
            case RunQuestionDto.QuestionTypeEnum.Match:
                return 'Сопоставить выражения';
            default:
                return '';
        }
    }
}
