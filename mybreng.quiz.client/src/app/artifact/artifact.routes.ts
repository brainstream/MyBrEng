import { Routes } from '@angular/router';
import { ListComponent } from './list';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ListComponent
    }
];
