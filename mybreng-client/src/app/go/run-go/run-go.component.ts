import { Component, Input } from '@angular/core';
import { RunDto, RunQuestionDto } from '@app/web-api';

@Component({
  selector: 'app-run-go',
  templateUrl: './run-go.component.html',
  styleUrls: ['./run-go.component.scss']
})
export class RunGoComponent {
    private _run: RunDto;

    currentQuestionIndex: number = 0;

    @Input() set run(dto: RunDto) {
        this._run = dto;
        this.currentQuestionIndex = 0;
    }

    get isCurrentQuestionFirst() {
        return this.currentQuestionIndex == 0;
    }

    get isCurrentQuestionLast() {
        const totalQuestions = this._run.questions?.length ?? 0;
        return totalQuestions - this.currentQuestionIndex  <= 1;
    }

    get currentQuestion(): RunQuestionDto | null {
        if (this._run.questions) {
            return this._run.questions[this.currentQuestionIndex];
        }
        return null;
    }

    goForward(): void {
        if (!this.isCurrentQuestionLast) {
            ++this.currentQuestionIndex;
        }
    }

    goBack(): void {
        // TODO: if question is answered
        if (!this.isCurrentQuestionFirst) {
            --this.currentQuestionIndex;
        }
    }
}
