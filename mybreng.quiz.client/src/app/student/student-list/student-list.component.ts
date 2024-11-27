import { Component, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@app/common';
import { StudentDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { StudentsSelectors, studentsActions, StudentsEventsService } from '../store';
import { Observable, Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StudentEditFormComponent } from '../student-edit-form';
import { Router } from '@angular/router';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    standalone: false
})
export class StudentListComponent implements OnInit, OnDestroy {
    readonly students$: Observable<StudentDto[]>;
    readonly loading$: Observable<boolean>;
    studentCreatedSubscription?: Subscription;

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        store$: Store,
        private readonly router: Router,
        private readonly events: StudentsEventsService,
        titleService: TitleService,
    ) {
        titleService.setTitle('Ученики');
        store$.dispatch(studentsActions.loadList());
        this.students$ = store$.select(StudentsSelectors.list);
        this.loading$ = store$.select(StudentsSelectors.loading);
    }

    ngOnInit(): void {
        this.studentCreatedSubscription = this.events.studentSaved$.subscribe(student => {
            this.router.navigate(['/student', student.id]);
        });
    }

    ngOnDestroy(): void {
        this.studentCreatedSubscription?.unsubscribe();
    }

    showCreateStudentForm() {
        this.bottomSheet.open(StudentEditFormComponent);
    }
}
