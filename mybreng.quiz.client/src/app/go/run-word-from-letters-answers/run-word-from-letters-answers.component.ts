import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';


interface AnswerData {
    text: string;
}

interface SlotData {
    answers: AnswerData[];
}

interface Data {
    answers: AnswerData[];
    slots: SlotData[];
    dropIds: string[];
}

@Component({
    selector: 'app-run-word-from-letters-answers',
    templateUrl: './run-word-from-letters-answers.component.html',
    styleUrl: './run-word-from-letters-answers.component.scss',
    imports: [DragDropModule]
})
export class RunWordFromLettersAnswersComponent implements OnInit, OnDestroy {
    public readonly data$ = new BehaviorSubject<Data>({
        answers: [],
        slots: [],
        dropIds: []
    });
    @Output() public readonly answersChange = new EventEmitter<string[]>();
    @Output() public readonly complete = new EventEmitter<boolean>();
    private isComplete = false;
    private inputSubscription?: Subscription;
    private readonly inputData$ = new BehaviorSubject<Data>({
        answers: [],
        slots: [],
        dropIds: []
    });
    private readonly inputAnswers$ = new BehaviorSubject<string[]>([]);
    private _variants: RunAnswerVariantDto[] = [];
    private _slotCount = 0;
    private restored = false;

    @Input() public set variants(variants: RunAnswerVariantDto[]) {
        this._variants = variants;
        this.rebuild();
    }

    @Input() public set slotCount(slotCount: number) {
        this._slotCount = slotCount;
        this.rebuild();
    }

    @Input() public set answer(words: string[]) {
        this.inputAnswers$.next(words);
    }

    public ngOnInit(): void {
        this.inputSubscription = combineLatest([
            this.inputData$,
            this.inputAnswers$
        ]).pipe(
            map(([data, words]) => {
                if(!this.restored) {
                    this.restore(data, words);
                    this.restored = true;
                }
                return data;
            })
        )
            .subscribe(this.data$);
    }

    public ngOnDestroy(): void {
        this.inputSubscription?.unsubscribe();
    }

    public drop(event: CdkDragDrop<AnswerData[]>): void {
        const formSlot = event.previousContainer.id.startsWith('slot-');
        const toSlot = event.container.id.startsWith('slot-');
        if(toSlot) {
            const isTargetEmpty = event.container.data.length === 0;
            if(formSlot) {
                if(isTargetEmpty) {
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
            } else if(isTargetEmpty) {
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
        } else if(formSlot) {
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
        this.handleAnswersChanges();
    }

    private rebuild(): void {
        this.inputData$.next(this.createData());
    }

    private createData(): Data {
        const dropIds: string[] = ['answer-list'];
        const answers: AnswerData[] = this.shuffleAnswers(
            this._variants.map(v => ({ text: v.text.toUpperCase() }))
        );
        const slots: SlotData[] = [];
        for(let i = 0; i < this._slotCount; ++i) {
            slots.push({
                answers: []
            });
            dropIds.push(`slot-${i}`);
        }
        return {
            answers,
            slots,
            dropIds
        };
    }

    private restore(data: Data, words: string[]): Data {
        const word = words.length > 0 ? words[0].toUpperCase() : '';
        if(!word) {
            return data;
        }
        for(const slot of data.slots) {
            slot.answers.length = 0;
        }
        const letters = data.answers;
        for(const ch of word) {
            const index = letters.findIndex(a => a.text === ch);
            if(index < 0) {
                break;
            }
            const letter = letters[index];
            const emptySlot = data.slots.find(s => s.answers.length === 0);
            if(!emptySlot) {
                break;
            }
            letters.splice(index, 1);
            emptySlot.answers.push(letter);
        }
        return data;
    }

    private shuffleAnswers(answers: AnswerData[]): AnswerData[] {
        return answers
            .map(answer => ({
                answer,
                rnd: Math.random()
            }))
            .sort((a, b) => a.rnd > b.rnd ? 1 : -1)
            .map(data => data.answer);
    }

    private handleAnswersChanges(): void {
        const data = this.data$.getValue();
        const word = data.slots
            .map(s => s.answers.length > 0 ? s.answers[0].text : '')
            .join('');
        this.answersChange.emit(word ? [word] : []);
        const complete = data.slots.every(s => s.answers.length > 0);
        if(this.isComplete !== complete) {
            this.isComplete = complete;
            this.complete.emit(complete);
        }
    }
}
