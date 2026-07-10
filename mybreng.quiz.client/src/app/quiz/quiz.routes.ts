import { Routes } from '@angular/router';
import { QuizListComponent } from './quiz-list';
import { QuizDetailsComponent } from './quiz-details';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: QuizListComponent
    }, {
        path: ':id',
        component: QuizDetailsComponent
    }
];
