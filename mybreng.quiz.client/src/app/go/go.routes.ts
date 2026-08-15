import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { RunComponent } from './run';
import { RunNotFoundComponent } from './run-not-found';
import { goReducer } from './store/go-reducer';
import { GoEffects } from './store/go-effects';

export const routes: Routes = [
    {
        path: ':id',
        component: RunComponent,
        providers: [provideState('go', goReducer), provideEffects(GoEffects)]
    }, {
        path: '**',
        component: RunNotFoundComponent
    }
];
