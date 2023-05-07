import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@app/common';
import { QuizDto, StudentDetailedDto, StudentEditDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { StudentsSelectors, studentsActions } from '../store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StudentEditFormComponent } from '../student-edit-form';
import { StudentAddRunFormComponent } from '../student-add-run-form';


@Component({
    selector: 'app-student-details',
    templateUrl: './student-details.component.html',
    styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    readonly loading$: Observable<boolean>;
    student: StudentDetailedDto | null;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly titleService: TitleService,
        private readonly bottomSheet: MatBottomSheet,
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
        })
        );
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
        const bs = this.bottomSheet
            .open(StudentEditFormComponent, {
                data: student,
            });
        const subscription = bs.afterDismissed().subscribe((result: StudentEditDto | undefined) => {
            if (result) {
                this.store$.dispatch(studentsActions.saveDetails({
                    student: {
                        ...result,
                        id: student.id
                    }
                }));
            }
            subscription.unsubscribe();
        });
    }

    deleteStudent(): void {

    }

    addRun(): void {
        const studentId = this.student?.id;
        if(studentId === undefined) {
            return;
        }
        const bs = this.bottomSheet.open(StudentAddRunFormComponent);
        const subscription = bs.afterDismissed().subscribe((quiz?: QuizDto ) => {
            subscription.unsubscribe();
            if (quiz) {
                this.store$.dispatch(studentsActions.addRun({
                    run: {
                        quizId: quiz.id,
                        studentId
                    }
                }));
            }
        });
    }
}
