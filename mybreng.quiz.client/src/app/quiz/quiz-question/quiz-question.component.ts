import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchingAnswer, parseMatchingAnswer } from '@app/shared';
import { QuizQuestionAnswerDto, QuizQuestionDto } from '@app/web-api';
import { MarkdownComponent } from '@app/markdown';
import { QuestionTypeNamePipe } from '../question-type-name.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-quiz-question',
    templateUrl: './quiz-question.component.html',
    styleUrls: ['./quiz-question.component.scss'],
    imports: [MarkdownComponent, QuestionTypeNamePipe, MatCardModule, MatChipsModule, MatMenuModule, MatIconModule, MatButtonModule, NgFor, NgIf]
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
