import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list';
import { StudentDetailsComponent } from './student-details';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StudentListComponent
    }, {
        path: ':id',
        component: StudentDetailsComponent
    }
];
