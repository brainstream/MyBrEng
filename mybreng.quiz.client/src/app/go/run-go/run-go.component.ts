import { Component, Input } from '@angular/core';
import { RunDto, RunQuestionDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { goActions } from '../store';

interface QuestionData {
    answers: string[],
    isComplete: boolean
}

@Component({
    selector: 'app-run-go',
    templateUrl: './run-go.component.html',
    styleUrls: ['./run-go.component.scss'],
    standalone: false
})
export class RunGoComponent {
    private _run: RunDto;

    title: string;
    description: string;
    currentQuestionIndex: number = 0;
    totalQuestionCount: number = 0;
    questions: QuestionData[];

    constructor(private readonly store$: Store) {
    }

    @Input() set run(dto: RunDto) {
        this._run = dto;
        this.title = dto.title;
        this.description = dto.description;
        this.totalQuestionCount = this._run.questions?.length ?? 0;
        this.currentQuestionIndex = 0;
        this.questions = this._run.questions?.map(_ => ({ answers: [], isComplete: false })) ?? [];
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
        return this.questions[this.currentQuestionIndex].isComplete;
    }

    completionChanged(completion: boolean): void {
        this.questions[this.currentQuestionIndex].isComplete = completion;
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
                    answers: this.questions[idx].answers
                }))
            }
        }));
    }
}
