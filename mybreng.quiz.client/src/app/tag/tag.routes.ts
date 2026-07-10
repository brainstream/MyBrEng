import { Routes } from '@angular/router';
import { TagListComponent } from './tag-list';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TagListComponent
    }
];
