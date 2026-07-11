import { Component, Input } from '@angular/core';
import { StudentDto } from '@app/web-api';
import { TagPaneComponent } from '@app/tag';
import { MatCard } from '@angular/material/card';
import { MatListItem } from '@angular/material/list';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-student-list-item',
    templateUrl: './student-list-item.component.html',
    styleUrls: ['./student-list-item.component.scss'],
    imports: [TagPaneComponent, MatCard, MatListItem, RouterLink]
})
export class StudentListItemComponent {
    @Input() public student: StudentDto;
}
