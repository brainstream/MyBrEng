import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchingAnswer, parseMatchingAnswer } from '@app/shared';
import { QuizQuestionAnswerDto, QuizQuestionDto } from '@app/web-api';
import { MarkdownComponent } from '@app/markdown';
import { QuestionTypeNamePipe } from '../question-type-name.pipe';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-quiz-question',
    templateUrl: './quiz-question.component.html',
    styleUrls: ['./quiz-question.component.scss'],
    imports: [MarkdownComponent, QuestionTypeNamePipe, MatCard, MatCardHeader, MatChip, MatCardSubtitle, MatIconButton, MatMenuTrigger, MatIcon, MatCardContent, MatMenu, MatMenuItem, NgFor, NgIf]
})
export class QuizQuestionComponent {
    @Input() question: QuizQuestionDto;
    @Input() position: number;
    @Output() editRequested = new EventEmitter<QuizQuestionDto>();
    @Output() deleteRequested = new EventEmitter<QuizQuestionDto>();
    @Output() cloneRequested = new EventEmitter<QuizQuestionDto>();

    getText(answer: QuizQuestionAnswerDto): string {
        if (this.question.questionType == QuizQuestionDto.QuestionTypeEnum.Match) {
            const matchingAnswer = parseMatchingAnswer(answer.text);
            const prefix = matchingAnswer.slot ? `${matchingAnswer.slot} → ` : '';
            return `${prefix}${matchingAnswer.answer}`;
        }
        return answer.text;
    }

    edit() {
        this.editRequested.emit(this.question);
    }

    delete() {
        this.deleteRequested.emit(this.question);
    }

    clone() {
        this.cloneRequested.emit(this.question);
    }
}
