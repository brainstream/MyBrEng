import { Component, Input } from '@angular/core';
import { RunAnswerDto, RunDto } from '@app/web-api';
import { IQuizReport, mapRunToReport } from './quiz-report';

@Component({
    selector: 'app-quiz-report',
    templateUrl: './quiz-report.component.html',
    styleUrls: ['./quiz-report.component.scss'],
    standalone: false
})
export class QuizReportComponent {
    report: IQuizReport;

    @Input() set run(run: RunDto) {
        this.report = mapRunToReport(run);
    }
}
