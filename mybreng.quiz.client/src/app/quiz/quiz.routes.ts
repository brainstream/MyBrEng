import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { QuizListComponent } from './quiz-list';
import { QuizDetailsComponent } from './quiz-details';
import { quizzesReducer } from './store/quizzes-reducer';
import { QuizzesEffects } from './store/quizzes-effects';

export const routes: Routes = [
    {
        path: '',
        providers: [provideState('quizzes', quizzesReducer), provideEffects(QuizzesEffects)],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: QuizListComponent
            }, {
                path: ':id',
                component: QuizDetailsComponent
            }
        ]
    }
];
