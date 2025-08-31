import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';

@Component({
    selector: 'app-run-match-answers',
    standalone: false,
    templateUrl: './run-match-answers.component.html',
    styleUrl: './run-match-answers.component.scss'
})
export class RunMatchAnswersComponent {
    private isComplete: boolean = false;

    answers: AnswerData[] = [];
    slots: SlotData[] = [];
    dropIds: string[] = [];

    @Input() set variants(variants : RunAnswerVariantDto[]) {
        let index = 0;
        this.dropIds = ['answer-list'];
        for (const variant of variants) {
            const json: AnswerVariantJson = JSON.parse(variant.text);
            if (json.src != null) {
                this.slots.push({
                    text: json.src,
                    answers: []
                });
                this.dropIds.push(`slot-${index++}`);
            }
            this.answers.push({
                id: variant.answerId,
                text: json.dest
            });
        }
    }

    @Input() set matches(jsons: string[]) {
        // TODO: initial matches (the Back button)
        // TODO: must be combined with variants
        // TODO: set isComplete, call this.checkForCompletion();
    }

    @Output() readonly matchesChange = new EventEmitter<string[]>;

    drop(event: CdkDragDrop<AnswerData[]>) {
        const formSlot = event.previousContainer.id.startsWith('slot-');
        const toSlot = event.container.id.startsWith('slot-');
        console.log(`From slot: ${formSlot}, Tp slot: ${toSlot}`);
        if (toSlot) {
            const isTargetEmpty = event.container.data.length == 0;
            if (formSlot) {
                if (isTargetEmpty) {
                    transferArrayItem(
                        event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        0
                    );
                } else {
                    transferArrayItem(
                        event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        0
                    );
                    transferArrayItem(
                        event.container.data,
                        event.previousContainer.data,
                        1,
                        0
                    );
                }
            } else {
                if (isTargetEmpty) {
                    transferArrayItem(
                        event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        0
                    );
                } else {
                    transferArrayItem(
                        event.container.data,
                        this.answers,
                        0,
                        this.answers.length
                    );
                    transferArrayItem(
                        event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        0
                    );
                }
            }
        } else {
            if (formSlot) {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
            } else {
                moveItemInArray(
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
            }
        }
        this.checkForCompletion();
    }

    private checkForCompletion() {
        let complete = true;
        for (const slot of this.slots) {
            if (slot.answers.length == 0) {
                complete = false;
                break;
            }
        }
        if (complete) {
            this.matchesChange.emit(this.slots.map(s => {
                const json: AnswerVariantJson = {
                    src: s.text,
                    dest: s.answers[0].text
                };
                return JSON.stringify(json);
            }));
        }
        else if (this.isComplete) {
            this.matchesChange.emit([]);
        }
        this.isComplete = complete;
    }
}

interface AnswerVariantJson {
    src: string | null,
    dest: string
}

interface AnswerData {
    id: string;
    text: string;
}

interface SlotData {
    text: string;
    answers: AnswerData[]
}
