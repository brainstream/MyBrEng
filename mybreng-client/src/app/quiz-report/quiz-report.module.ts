import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { QuizReportComponent } from './quiz-report.component';
import { QuizReportItemComponent } from './quiz-report-item';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from '@app/markdown';

@NgModule({
    declarations: [
        QuizReportComponent,
        QuizReportItemComponent
    ],
    exports: [
        QuizReportComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatCardModule,
        MarkdownModule
    ]
})
export class QuizReportModule { }
