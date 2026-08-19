import { Component, Input } from '@angular/core';
import { IQuizReportItem } from '../quiz-report';
import { RunQuestionDto } from '@app/web-api';
import { MarkdownComponent } from '@app/markdown';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-quiz-report-item',
    templateUrl: './quiz-report-item.component.html',
    styleUrls: ['./quiz-report-item.component.scss'],
    host: {
        'class': 'quiz-report-item'
    },
    imports: [
        MarkdownComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatChip,
        MatCardSubtitle,
        MatIcon,
        MatDivider,
        MatCardContent,
        NgFor,
        NgIf
    ]
})
export class QuizReportItemComponent {
    @Input() public data: IQuizReportItem;
    @Input() public index: number;

    public get questionDescription(): string {
        switch(this.data.questionType) {
            case RunQuestionDto.QuestionTypeEnum.FreeText:
                return 'Вписать ответ';
            case RunQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'Выбрать все правильные ответы';
            case RunQuestionDto.QuestionTypeEnum.SingleChoice:
                return 'Выбрать любой правильный ответ';
            case RunQuestionDto.QuestionTypeEnum.Match:
                return 'Сопоставить выражения';
            case RunQuestionDto.QuestionTypeEnum.WordFromLetters:
                return 'Составить слово из букв';
            default:
                throw new Error(`Unexpected question type: ${this.data.questionType as never}`);
        }
    }
}
