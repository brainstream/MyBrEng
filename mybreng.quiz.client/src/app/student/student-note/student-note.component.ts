import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StudentDetailedDto } from '@app/web-api';
import { Store } from '@ngrx/store';
import { studentsActions, StudentsEventsService } from '../store';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MarkdownPipe } from '@app/markdown';

@Component({
    selector: 'app-student-note',
    templateUrl: './student-note.component.html',
    styleUrls: ['./student-note.component.scss'],
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatMenuModule, MatIconModule, FormsModule, NgIf, MarkdownPipe]
})
export class StudentNoteComponent implements OnInit, OnDestroy {
    private _studentId: string;
    private _originalText: string;
    private eventSubscription?: Subscription;

    editMode: boolean = false;
    note: string;

    constructor(
        private readonly store$: Store,
        private readonly events: StudentsEventsService
    ) {
    }

    ngOnInit(): void {
        this.eventSubscription = this.events.noteSaved$.subscribe(({ studentId, note }) => {
            if (this._studentId === studentId) {
                this._originalText = note ?? '';
                this.note = this._originalText;
                this.editMode = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.eventSubscription?.unsubscribe();
    }

    @Input() set student(value: StudentDetailedDto) {
        this._studentId = value.id;
        this._originalText = value.note ?? '';
        this.note = this._originalText;
    }

    edit() {
        this.editMode = true;
    }

    cancelEdit() {
        this.editMode = false;
        this.note = this._originalText;
    }

    save() {
        this.store$.dispatch(studentsActions.setNote({
            dto: {
                studentId: this._studentId,
                note: this.note
            }
        }))
    }
}
