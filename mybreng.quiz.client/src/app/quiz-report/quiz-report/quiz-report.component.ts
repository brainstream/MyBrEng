import { Component, Input } from '@angular/core';
import { RunDto } from '@app/web-api';
import { IQuizReport, mapRunToReport } from './quiz-report';
import { QuizReportItemComponent } from '../quiz-report-item';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-quiz-report',
    templateUrl: './quiz-report.component.html',
    styleUrls: ['./quiz-report.component.scss'],
    imports: [QuizReportItemComponent, MatCard, MatCardContent, NgFor]
})
export class QuizReportComponent {
    public report: IQuizReport;

    @Input() public set run(run: RunDto) {
        this.report = mapRunToReport(run);
    }
}
