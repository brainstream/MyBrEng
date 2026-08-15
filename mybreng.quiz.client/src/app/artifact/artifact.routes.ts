import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ListComponent } from './list';
import { artifactsReducer } from './store/artifacts-reducer';
import { ArtifactsEffects } from './store/artifacts-effects';

export const routes: Routes = [
    {
        path: '',
        providers: [provideState('artifacts', artifactsReducer), provideEffects(ArtifactsEffects)],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ListComponent
            }
        ]
    }
];
