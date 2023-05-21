import { Component, Input } from '@angular/core';
import { RunDto, RunQuestionDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { goActions } from '../store';

@Component({
  selector: 'app-run-go',
  templateUrl: './run-go.component.html',
  styleUrls: ['./run-go.component.scss']
})
export class RunGoComponent {
    private _run: RunDto;

    currentQuestionIndex: number = 0;
    totalQuestionCount: number = 0;
    answers: string[][];

    constructor(private readonly store$: Store) {
    }

    @Input() set run(dto: RunDto) {
        this._run = dto;
        this.totalQuestionCount = this._run.questions?.length ?? 0;
        this.currentQuestionIndex = 0;
        this.answers = this._run.questions?.map(_ => []) ?? [];
    }

    get isCurrentQuestionFirst() {
        return this.currentQuestionIndex == 0;
    }

    get isCurrentQuestionLast() {
        return this.totalQuestionCount - this.currentQuestionIndex  <= 1;
    }

    get currentQuestion(): RunQuestionDto | null {
        if (this._run.questions) {
            return this._run.questions[this.currentQuestionIndex];
        }
        return null;
    }

    get isCurrentQuestionAnswered(): boolean {
        return this.answers[this.currentQuestionIndex].length > 0;
    }

    goForward(): void {
        if (!this.isCurrentQuestionLast) {
            ++this.currentQuestionIndex;
        }
    }

    goBack(): void {
        if (!this.isCurrentQuestionFirst) {
            --this.currentQuestionIndex;
        }
    }

    finish(): void {
        if(!this._run.id || !this._run.questions) {
            return;
        }
        this.store$.dispatch(goActions.finish({
            result: {
                id: this._run.id,
                questions: this._run.questions.map((q, idx) => ({
                    id: q.questionId,
                    answers: this.answers[idx]
                }))
            }
        }));
    }
}
