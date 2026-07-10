import { Routes } from '@angular/router';
import { RunComponent } from './run';
import { RunNotFoundComponent } from './run-not-found';

export const routes: Routes = [
    {
        path: ':id',
        component: RunComponent
    }, {
        path: '**',
        component: RunNotFoundComponent
    }
];
