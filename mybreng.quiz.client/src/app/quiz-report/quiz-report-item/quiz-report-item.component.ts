import { Component, Input } from '@angular/core';
import { IQuizReportItem } from '../quiz-report';
import { RunQuestionDto } from '@app/web-api';
import { MarkdownComponent } from '@app/markdown';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-quiz-report-item',
    templateUrl: './quiz-report-item.component.html',
    styleUrls: ['./quiz-report-item.component.scss'],
    host: {
        'class': 'quiz-report-item'
    },
    imports: [MarkdownComponent, MatCardModule, MatChipsModule, MatIconModule, MatDividerModule, NgFor, NgIf]
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
