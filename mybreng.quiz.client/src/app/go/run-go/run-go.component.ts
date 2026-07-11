import { Component, Input } from '@angular/core';
import { RunDto, RunQuestionDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { goActions, RunQuestionComponent } from '@app/go';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

interface QuestionData {
    answers: string[],
    isComplete: boolean
}

@Component({
    selector: 'app-run-go',
    templateUrl: './run-go.component.html',
    styleUrls: ['./run-go.component.scss'],
    imports: [RunQuestionComponent, MatCard, MatCardHeader, MatCardSubtitle, MatCardContent, MatButton, MatIcon, NgIf]
})
export class RunGoComponent {
    public title: string;
    public description: string;
    public currentQuestionIndex = 0;
    public totalQuestionCount = 0;
    public questions: QuestionData[];

    constructor(private readonly store$: Store) {
    }

    private _run: RunDto;

    @Input() public set run(dto: RunDto) {
        this._run = dto;
        this.title = dto.title;
        this.description = dto.description;
        this.totalQuestionCount = this._run.questions?.length ?? 0;
        this.currentQuestionIndex = 0;
        this.questions = this._run.questions?.map(_ => ({ answers: [], isComplete: false })) ?? [];
    }

    public get isCurrentQuestionFirst(): boolean {
        return this.currentQuestionIndex === 0;
    }

    public get isCurrentQuestionLast(): boolean {
        return this.totalQuestionCount - this.currentQuestionIndex <= 1;
    }

    public get currentQuestion(): RunQuestionDto | null {
        if(this._run.questions) {
            return this._run.questions[this.currentQuestionIndex];
        }
        return null;
    }

    public get isCurrentQuestionAnswered(): boolean {
        return this.questions[this.currentQuestionIndex].isComplete;
    }

    public completionChanged(completion: boolean): void {
        this.questions[this.currentQuestionIndex].isComplete = completion;
    }

    public goForward(): void {
        if(!this.isCurrentQuestionLast) {
            ++this.currentQuestionIndex;
        }
    }

    public goBack(): void {
        if(!this.isCurrentQuestionFirst) {
            --this.currentQuestionIndex;
        }
    }

    public finish(): void {
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
