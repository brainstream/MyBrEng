import { Component, Input } from '@angular/core';
import { RunAnswerDto, RunDto } from '@app/web-api';
import { IRunReportItem } from './quiz-report-item';

@Component({
    selector: 'app-quiz-report',
    templateUrl: './quiz-report.component.html',
    styleUrls: ['./quiz-report.component.scss']
})
export class QuizReportComponent {
    items: IRunReportItem[];

    @Input() set run(run: RunDto) {
        this.items = run.questions?.map(q => ({
            question: q,
            answer: this.getAnswer(run, q.questionId)
        })) ?? [];
    }

    private getAnswer(run: RunDto, questionId: string): RunAnswerDto | null {
        if (!run.report) {
            return null;
        }
        for (const answer of run.report) {
            if (answer.questionId == questionId) {
                return answer;
            }
        }
        return null;
    }
}
