import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { QuizReportComponent } from './quiz-report';
import { QuizReportItemComponent } from './quiz-report-item';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MarkdownModule } from '@app/markdown';
import { MatDividerModule } from '@angular/material/divider';
import { QuizReportStandaloneComponent } from './quiz-report-standalone';
import { QuizReportRoutingModule } from './quiz-report-routing.module';
import { LayoutModule } from '@app/layout';

@NgModule({
    declarations: [
        QuizReportComponent,
        QuizReportItemComponent,
        QuizReportStandaloneComponent
    ],
    exports: [
        QuizReportComponent
    ],
    imports: [
        CommonModule,
        QuizReportRoutingModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MarkdownModule,
        LayoutModule
    ]
})
export class QuizReportModule { }
