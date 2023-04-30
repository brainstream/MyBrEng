import { Component } from '@angular/core';
import { TitleService } from '@app/common';
import { StudentDto, StudentService } from '@app/web-api';
import { Store } from '@ngrx/store';
import { StudentsSelectors, studentsActions } from '../store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
    readonly students$: Observable<StudentDto[]>;

    constructor(titleService: TitleService, store$: Store) {
        titleService.setTitle('Ученики');
        store$.dispatch(studentsActions.loadList());
        this.students$ = store$.select(StudentsSelectors.list);
    }
}
