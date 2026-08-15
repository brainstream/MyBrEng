import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { TagListComponent } from './tag-list';
import { tagsReducer } from './store/tags-reducer';
import { TagsEffects } from './store/tags-effects';

export const routes: Routes = [
    {
        path: '',
        providers: [provideState('tags', tagsReducer), provideEffects(TagsEffects)],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: TagListComponent
            }
        ]
    }
];
