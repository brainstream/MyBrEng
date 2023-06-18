import { Component, Input } from '@angular/core';
import { StudentDto } from '@app/web-api';

@Component({
    selector: 'app-student-list-item',
    templateUrl: './student-list-item.component.html',
    styleUrls: ['./student-list-item.component.scss']
})
export class StudentListItemComponent {
    @Input() student: StudentDto;
}
