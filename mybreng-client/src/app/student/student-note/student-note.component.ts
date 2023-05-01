import { Component, Input } from '@angular/core';
import { StudentDetailedDto } from '@app/web-api';

@Component({
    selector: 'app-student-note',
    templateUrl: './student-note.component.html',
    styleUrls: ['./student-note.component.scss']
})
export class StudentNoteComponent {
    @Input() student: StudentDetailedDto;
}
