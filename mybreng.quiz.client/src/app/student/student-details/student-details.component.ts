import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogButton, ConfirmDialogService, TitleService } from '@app/common';
import { RunSummaryDto, StudentDetailedDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { studentsActions, StudentsEventsService, StudentsSelectors } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StudentEditFormComponent } from '../student-edit-form';
import { StudentAddRunFormComponent } from '../student-add-run-form';
import { collapseOnLeaveAnimation } from 'angular-animations';
import { LayoutFullComponent } from '@app/layout';
import { TagPaneComponent } from '@app/tag';
import { StudentNoteComponent } from '../student-note';
import { StudentQuizRunComponent } from '../student-quiz-run';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'app-student-details',
    templateUrl: './student-details.component.html',
    styleUrls: ['./student-details.component.scss'],
    animations: [
        collapseOnLeaveAnimation()
    ],
    imports: [
        LayoutFullComponent,
        TagPaneComponent,
        StudentNoteComponent,
        StudentQuizRunComponent,
        AsyncPipe,
        NgFor,
        NgIf,
        MatMenu,
        MatMenuItem,
        MatIcon
    ]
})
export class StudentDetailsComponent implements OnInit, OnDestroy {
    public readonly loading$: Observable<boolean>;
    public student: StudentDetailedDto | null;
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly titleService: TitleService,
        private readonly bottomSheet: MatBottomSheet,
        private readonly confirmDialog: ConfirmDialogService,
        private readonly events: StudentsEventsService,
        private readonly store$: Store
    ) {
        this.loading$ = store$.select(StudentsSelectors.loading);
    }

    public ngOnInit(): void {
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if(id) {
                this.store$.dispatch(studentsActions.loadDetails({ id }));
            }
        }));
        this.subscriptions.push(this.store$
            .select(StudentsSelectors.details)
            .subscribe(student => {
                this.student = student;
                if(student) {
                    const latName = student.lastName ? ` ${student.lastName}` : '';
                    this.titleService.setTitle(`${student.firstName}${latName}`);
                }
            }));
        this.subscriptions.push(this.events.studentDeleted$.subscribe(() => {
            this.router.navigate(['/student']);
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    public editStudent(): void {
        this.store$.dispatch(studentsActions.loadAvailableTags());
        const student = this.student;
        if(!student) {
            return;
        }
        this.bottomSheet.open(StudentEditFormComponent, { data: student });
    }

    public async deleteStudent(): Promise<void> {
        const studentId = this.student?.id;
        if(!studentId) {
            return;
        }
        const result = await this.confirmDialog.show({
            text: 'Вы действительно хотите удалить этого ученика?',
            buttons: {
                yes: {
                    text: 'Удалить',
                    icon: 'delete',
                    color: 'warn'
                },
                no: {
                    text: 'Отменить',
                    color: 'default'
                }
            }
        });
        if(result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(studentsActions.deleteStudent({ id: studentId }));
        }
    }

    public addRun(): void {
        const studentId = this.student?.id;
        if(studentId === undefined) {
            return;
        }
        this.bottomSheet.open(StudentAddRunFormComponent, {
            data: { studentId }
        });
    }

    public async deleteRun(run: RunSummaryDto): Promise<void> {
        const result = await this.confirmDialog.show({
            text: `Вы действительно хотите удалить у этого ученика тестирование "${run.quizTitle}"?`,
            buttons: {
                yes: {
                    text: 'Удалить',
                    icon: 'delete',
                    color: 'warn'
                },
                no: {
                    text: 'Отменить',
                    color: 'default'
                }
            }
        });
        if(result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(studentsActions.deleteRun({ id: run.id }));
        }
    }
}
