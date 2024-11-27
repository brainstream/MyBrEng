import { Component, Input } from '@angular/core';
import { QuizDto } from '@app/web-api';

@Component({
    selector: 'app-quiz-list-item',
    templateUrl: './quiz-list-item.component.html',
    styleUrls: ['./quiz-list-item.component.scss'],
    standalone: false
})
export class QuizListItemComponent {
    @Input() quiz: QuizDto;
}
