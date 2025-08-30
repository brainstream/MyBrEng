import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
    selector: 'app-run-match-answers',
    standalone: false,
    templateUrl: './run-match-answers.component.html',
    styleUrl: './run-match-answers.component.scss'
})
export class RunMatchAnswersComponent {
    answers: IAnswerData[] = [{
        id: '1',
        text: 'Foo'
    }, {
        id: '2',
        text: 'Bar'
    }, {
        id: '3',
        text: 'Baz'
    }];
    slots: ISlotData[] = [{
        text: 'One',
        answers: []
    }, {
        text: 'Two',
        answers: []
    }, {
        text: 'Three',
        answers: []
    }];

    dropIds = [
        'answer-list',
        ...this.slots.map((_, index) => `slot-${index}`)
    ];

    drop(event: CdkDragDrop<IAnswerData[]>) {
        const formSlot = event.previousContainer.id.startsWith('slot-');
        const toSlot = event.container.id.startsWith('slot-');
        if (toSlot) {
            const isTargetEmpty = event.container.data.length == 0;
            if (formSlot) {
                if (isTargetEmpty) {
                    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 0);
                } else {
                    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 0);
                    transferArrayItem(event.container.data, event.previousContainer.data, 1, 0);
                }
            } else {
                if (isTargetEmpty) {
                    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 0);
                } else {
                    transferArrayItem(event.container.data, this.answers, 0, this.answers.length);
                    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 0);
                }
            }
        } else {
            if (formSlot) {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            } else {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            }
        }
    }
}

interface IAnswerData {
    id: string;
    text: string;
}

interface ISlotData {
    text: string;
    answers: IAnswerData[]
}
