import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogButton, ConfirmDialogService, TitleService } from '@app/common';
import { RunSummaryDto, StudentDetailedDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { StudentsSelectors, studentsActions, StudentsEventsService } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StudentEditFormComponent } from '../student-edit-form';
import { StudentAddRunFormComponent } from '../student-add-run-form';
import { collapseOnLeaveAnimation } from 'angular-animations';


@Component({
    selector: 'app-student-details',
    templateUrl: './student-details.component.html',
    styleUrls: ['./student-details.component.scss'],
    animations: [
        collapseOnLeaveAnimation()
    ]
})
export class StudentDetailsComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    readonly loading$: Observable<boolean>;
    student: StudentDetailedDto | null;

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

    ngOnInit(): void {
        this.subscriptions.push(this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.store$.dispatch(studentsActions.loadDetails({ id }))
            }
        }));
        this.subscriptions.push(this.store$
            .select(StudentsSelectors.details)
            .subscribe(student => {
                this.student = student;
                if (student) {
                    const latName = student.lastName ? ` ${student.lastName}` : '';
                    this.titleService.setTitle(`${student.firstName}${latName}`);
                }
            })
        );
        this.subscriptions.push(this.events.studentDeleted$.subscribe(() => {
            this.router.navigate(['/student']);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    editStudent(): void {
        const student = this.student;
        if (!student) {
            return;
        }
        this.bottomSheet.open(StudentEditFormComponent, { data: student });
    }

    async deleteStudent() {
        const studentId = this.student?.id;
        if (!studentId) {
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
        if (result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(studentsActions.deleteStudent({ id: studentId }));
        }
    }

    addRun(): void {
        const studentId = this.student?.id;
        if (studentId === undefined) {
            return;
        }
        this.bottomSheet.open(StudentAddRunFormComponent, {
            data: { studentId }
        });
    }

    async deleteRun(run: RunSummaryDto) {
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
        if (result.button === ConfirmDialogButton.Yes) {
            this.store$.dispatch(studentsActions.deleteRun({ id: run.id }));
        }
    }
}
