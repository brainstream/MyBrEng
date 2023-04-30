import { Component } from '@angular/core';
import { TitleService } from '@app/common';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  constructor(titleService: TitleService) {
    titleService.setTitle('Ученики');
  }
}
