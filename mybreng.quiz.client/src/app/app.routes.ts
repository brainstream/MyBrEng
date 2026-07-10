import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'quiz',
        loadChildren: () => import('./quiz/quiz.routes').then(m => m.routes)
    }, {
        path: 'student',
        loadChildren: () => import('./student/student.routes').then(m => m.routes)
    }, {
        path: 'tag',
        loadChildren: () => import('./tag/tag.routes').then(m => m.routes)
    }, {
        path: 'go',
        loadChildren: () => import('./go/go.routes').then(m => m.routes)
    }, {
        path: 'report',
        loadChildren: () => import('./quiz-report/quiz-report.routes').then(m => m.routes)
    }, {
        path: 'artifact',
        loadChildren: () => import('./artifact/artifact.routes').then(m => m.routes)
    }, {
        path: '**',
        redirectTo: 'quiz'
    }
];
