import { Component, Input } from '@angular/core';
import { QuizDto } from '@app/web-api';
import { TagPaneComponent } from '@app/tag';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-quiz-list-item',
    templateUrl: './quiz-list-item.component.html',
    styleUrls: ['./quiz-list-item.component.scss'],
    imports: [TagPaneComponent, MatCardModule, MatListModule, RouterLink, NgIf]
})
export class QuizListItemComponent {
    @Input() quiz: QuizDto;
}
