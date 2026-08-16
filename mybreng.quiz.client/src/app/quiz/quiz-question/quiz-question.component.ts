import { Component, EventEmitter, Input, Output } from '@angular/core';
import { parseMatchingAnswer } from '@app/shared';
import { QuizQuestionAnswerDto, QuizQuestionDto } from '@app/web-api';
import { MarkdownComponent } from '@app/markdown';
import { QuestionTypeNamePipe } from '../question-type-name.pipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-quiz-question',
    templateUrl: './quiz-question.component.html',
    styleUrls: ['./quiz-question.component.scss'],
    imports: [
        MarkdownComponent,
        QuestionTypeNamePipe,
        MatCard,
        MatCardHeader,
        MatChip,
        MatCardSubtitle,
        MatIconButton,
        MatMenuTrigger,
        MatIcon,
        MatCardContent,
        MatMenu,
        MatMenuItem,
        NgFor,
        NgIf
    ]
})
export class QuizQuestionComponent {
    @Input() public question: QuizQuestionDto;
    @Input() public position: number;
    @Output() public editRequested = new EventEmitter<QuizQuestionDto>();
    @Output() public deleteRequested = new EventEmitter<QuizQuestionDto>();
    @Output() public cloneRequested = new EventEmitter<QuizQuestionDto>();

    public getText(answer: QuizQuestionAnswerDto): string {
        if(this.question.questionType === QuizQuestionDto.QuestionTypeEnum.Match) {
            const matchingAnswer = parseMatchingAnswer(answer.text);
            const prefix = matchingAnswer.slot ? `${matchingAnswer.slot} → ` : '';
            return `${prefix}${matchingAnswer.answer}`;
        }
        return answer.text;
    }

    public get wordAnswer(): string | null {
        return this.question.wordAnswer ?? null;
    }

    public edit(): void {
        this.editRequested.emit(this.question);
    }

    public delete(): void {
        this.deleteRequested.emit(this.question);
    }

    public clone(): void {
        this.cloneRequested.emit(this.question);
    }
}
