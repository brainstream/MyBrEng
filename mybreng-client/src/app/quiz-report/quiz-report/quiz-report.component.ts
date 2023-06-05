import { Component, Input } from '@angular/core';
import { RunAnswerDto, RunDto } from '@app/web-api';
import { IQuizRepor, mapRunToReport } from './quiz-report';

@Component({
    selector: 'app-quiz-report',
    templateUrl: './quiz-report.component.html',
    styleUrls: ['./quiz-report.component.scss']
})
export class QuizReportComponent {
    report: IQuizRepor;

    @Input() set run(run: RunDto) {
        this.report = mapRunToReport(run);
    }
}
