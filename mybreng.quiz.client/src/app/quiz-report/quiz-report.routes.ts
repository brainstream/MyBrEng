import { Routes } from '@angular/router';
import { QuizReportStandaloneComponent } from './quiz-report-standalone';

export const routes: Routes = [{
        path: ':id',
        component: QuizReportStandaloneComponent
    }
];
