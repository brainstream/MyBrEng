import { Component, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@app/common';
import { StudentDto, TagDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { studentsActions, StudentsEventsService, StudentsSelectors } from '../store';
import { Observable, Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StudentEditFormComponent } from '../student-edit-form';
import { Router } from '@angular/router';
import { IListFilter, ListFilterPanelComponent } from '@app/list-filter';
import { LayoutFullComponent } from '@app/layout';
import { StudentListItemComponent } from '../student-list-item';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    imports: [
        LayoutFullComponent,
        StudentListItemComponent,
        ListFilterPanelComponent,
        AsyncPipe,
        NgFor,
        MatNavList,
        MatMenu,
        MatMenuItem,
        MatIcon
    ]
})
export class StudentListComponent implements OnInit, OnDestroy {
    public readonly students$: Observable<StudentDto[]>;
    public readonly loading$: Observable<boolean>;
    public studentCreatedSubscription?: Subscription;
    public readonly availableTags$: Observable<TagDto[]>;

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly store$: Store,
        private readonly router: Router,
        private readonly events: StudentsEventsService,
        titleService: TitleService
    ) {
        titleService.setTitle('Ученики');
        this.students$ = store$.select(StudentsSelectors.list);
        this.availableTags$ = store$.select(StudentsSelectors.availableTags);
        this.loading$ = store$.select(StudentsSelectors.loading);
        store$.dispatch(studentsActions.loadList());
        store$.dispatch(studentsActions.loadAvailableTags());
    }

    public ngOnInit(): void {
        this.studentCreatedSubscription = this.events.studentSaved$.subscribe(student => {
            this.router.navigate(['/student', student.id]);
        });
    }

    public ngOnDestroy(): void {
        this.studentCreatedSubscription?.unsubscribe();
    }

    public showCreateStudentForm(): void {
        this.bottomSheet.open(StudentEditFormComponent);
    }

    public applyFilter(filter: IListFilter): void {
        this.store$.dispatch(studentsActions.applyFilter({ filter }));
    }
}
