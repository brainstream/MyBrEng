import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { StudentListComponent } from './student-list';
import { StudentDetailsComponent } from './student-details';
import { studentsReducer } from './store/students-reducer';
import { StudentsEffects } from './store/students-effects';

export const routes: Routes = [
    {
        path: '',
        providers: [provideState('students', studentsReducer), provideEffects(StudentsEffects)],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: StudentListComponent
            }, {
                path: ':id',
                component: StudentDetailsComponent
            }
        ]
    }
];
