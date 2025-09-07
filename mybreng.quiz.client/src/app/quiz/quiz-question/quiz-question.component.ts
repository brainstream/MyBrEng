import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchingAnswer } from '@app/shared';
import { QuizQuestionAnswerDto, QuizQuestionDto } from '@app/web-api';

@Component({
    selector: 'app-quiz-question',
    templateUrl: './quiz-question.component.html',
    styleUrls: ['./quiz-question.component.scss'],
    standalone: false
})
export class QuizQuestionComponent {
    @Input() question: QuizQuestionDto;
    @Input() position: number;
    @Output() editRequested = new EventEmitter<QuizQuestionDto>();
    @Output() deleteRequested = new EventEmitter<QuizQuestionDto>();
    @Output() cloneRequested = new EventEmitter<QuizQuestionDto>();

    getText(answer: QuizQuestionAnswerDto): string {
        if (this.question.questionType == QuizQuestionDto.QuestionTypeEnum.Match) {
            const matchingAnswer = JSON.parse(answer.text) as MatchingAnswer;
            const prefix = matchingAnswer.slot ? `${matchingAnswer.slot} 🡒 ` : '';
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
