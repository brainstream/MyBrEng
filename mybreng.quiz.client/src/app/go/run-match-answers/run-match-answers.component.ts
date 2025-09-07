import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';

interface AnswerVariantJson {
    src: string | null;
    dest: string;
}

interface AnswerData {
    text: string;
}

interface SlotData {
    text: string;
    answers: AnswerData[];
}

interface Data {
    answers: AnswerData[];
    slots: SlotData[];
    dropIds: string[];
}

@Component({
    selector: 'app-run-match-answers',
    standalone: false,
    templateUrl: './run-match-answers.component.html',
    styleUrl: './run-match-answers.component.scss',
})
export class RunMatchAnswersComponent implements OnInit, OnDestroy {
    private isComplete: boolean = false;
    private inputSubscription?: Subscription;

    private inputData$ = new BehaviorSubject<Data>({
        answers: [],
        slots: [],
        dropIds: []
    });

    private inputMatches$ = new BehaviorSubject<AnswerVariantJson[]>([]);

    data$ = new BehaviorSubject<Data>({
        answers: [],
        slots: [],
        dropIds: []
    });

    @Input() set variants(variants: RunAnswerVariantDto[]) {
        let index = 0;
        const dropIds: string[] = ['answer-list'];
        const answers: AnswerData[] = [];
        const slots: SlotData[] = [];
        for (const variant of variants) {
            const json: AnswerVariantJson = JSON.parse(variant.text);
            if (json.src != null) {
                slots.push({
                    text: json.src,
                    answers: []
                });
                dropIds.push(`slot-${index++}`);
            }
            answers.push({
                text: json.dest
            });
        }
        this.inputData$.next({
            answers,
            slots,
            dropIds
        });
    }

    @Input() set matches(jsons: string[]) {
        this.inputMatches$.next(
            jsons.map((json) => JSON.parse(json) as AnswerVariantJson)
        );
    }

    @Output() readonly matchesChange = new EventEmitter<string[]>();

    @Output() readonly complete = new EventEmitter<boolean>();

    ngOnInit(): void {
        this.inputSubscription = combineLatest([
            this.inputData$,
            this.inputMatches$
        ]).pipe(
            map(([data, matches]) => {
                for (const match of matches) {
                    const answerIndex = data.answers.findIndex(a => a.text === match.src);
                    const slotIndex = data.slots.findIndex(s => s.text == match.dest);
                    if (answerIndex >= 0 && slotIndex >= 0) {
                        transferArrayItem(
                            data.answers,
                            data.slots[slotIndex].answers,
                            answerIndex,
                            0
                        );
                    }
                }
                return data;
            })
        )
        .subscribe(this.data$);
    }

    ngOnDestroy(): void {
        this.inputSubscription?.unsubscribe();
    }

    drop(event: CdkDragDrop<AnswerData[]>) {
        const formSlot = event.previousContainer.id.startsWith('slot-');
        const toSlot = event.container.id.startsWith('slot-');
        console.log(`From slot: ${formSlot}, Tp slot: ${toSlot}`);
        if (toSlot) {
            const isTargetEmpty = event.container.data.length === 0;
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
                        event.previousContainer.data,
                        0,
                        event.container.data.length
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
        this.handleMatchChanges();
    }

    private handleMatchChanges(): void {
        const data = this.data$.getValue();
        let complete = true;
        for (const slot of data.slots) {
            if (slot.answers.length === 0) {
                complete = false;
                break;
            }
        }
        const matches = data.slots.map(s => {
            const json: AnswerVariantJson = {
                src: s.answers.length ? s.answers[0].text : null,
                dest: s.text
            };
            return JSON.stringify(json);
        });
        this.matchesChange.emit(matches);
        if (this.isComplete != complete) {
            this.isComplete = complete;
            this.complete.emit(complete);
        }
    }
}
