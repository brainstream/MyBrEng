import { Component, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@app/common';
import { StudentDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { StudentsSelectors, studentsActions, StudentsEventsService } from '../store';
import { Observable, Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StudentEditFormComponent } from '../student-edit-form';
import { Router } from '@angular/router';
import { IListFilter } from '@app/list-filter';
import { LayoutFullComponent } from '@app/layout';
import { StudentListItemComponent } from '../student-list-item';
import { ListFilterPanelComponent } from '@app/list-filter';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    imports: [LayoutFullComponent, StudentListItemComponent, ListFilterPanelComponent, AsyncPipe, NgFor, MatMenuModule, MatIconModule, MatListModule]
})
export class StudentListComponent implements OnInit, OnDestroy {
    readonly students$: Observable<StudentDto[]>;
    readonly loading$: Observable<boolean>;
    studentCreatedSubscription?: Subscription;
    readonly availableTags$: Observable<TagDto[]>;

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly store$: Store,
        private readonly router: Router,
        private readonly events: StudentsEventsService,
        titleService: TitleService,
    ) {
        titleService.setTitle('Ученики');
        this.students$ = store$.select(StudentsSelectors.list);
        this.availableTags$ = store$.select(StudentsSelectors.availableTags);
        this.loading$ = store$.select(StudentsSelectors.loading);
        store$.dispatch(studentsActions.loadList());
        store$.dispatch(studentsActions.loadAvailableTags());
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

    applyFilter(filter: IListFilter) {
        this.store$.dispatch(studentsActions.applyFilter({ filter }));
    }
}
