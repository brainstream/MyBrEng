import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatchingAnswer, parseMatchingAnswer } from '@app/shared';
import { RunAnswerVariantDto } from '@app/web-api';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {
    createSlotDropIds,
    DragDropAnswersData,
    DragDropAnswerItem,
    DragDropSlotItem,
    handleDragDropSlotTransfer
} from '../shared';

@Component({
    selector: 'app-run-match-answers',
    templateUrl: './run-match-answers.component.html',
    styleUrl: './run-match-answers.component.scss',
    imports: [MatIcon, DragDropModule]
})
export class RunMatchAnswersComponent implements OnInit, OnDestroy {
    public data$ = new BehaviorSubject<DragDropAnswersData>({
        answers: [],
        slots: [],
        dropIds: []
    });
    @Output() public readonly matchesChange = new EventEmitter<string[]>();
    @Output() public readonly complete = new EventEmitter<boolean>();
    private isComplete = false;
    private inputSubscription?: Subscription;
    private readonly inputData$ = new BehaviorSubject<DragDropAnswersData>({
        answers: [],
        slots: [],
        dropIds: []
    });
    private readonly inputMatches$ = new BehaviorSubject<MatchingAnswer[]>([]);
    private _variants: RunAnswerVariantDto[] = [];
    private _slots: string[] = [];
    private restored = false;

    @Input() public set variants(variants: RunAnswerVariantDto[]) {
        this._variants = variants;
        this.rebuild();
    }

    @Input() public set slots(slots: string[]) {
        this._slots = slots;
        this.rebuild();
    }

    @Input() public set matches(jsons: string[]) {
        this.inputMatches$.next(
            jsons.map(parseMatchingAnswer)
        );
    }

    public ngOnInit(): void {
        this.inputSubscription = combineLatest([
            this.inputData$,
            this.inputMatches$
        ]).pipe(
            map(([data, matches]) => {
                if(!this.restored) {
                    this.restore(data, matches);
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

    public drop(event: CdkDragDrop<DragDropAnswerItem[]>): void {
        handleDragDropSlotTransfer(event);
        this.handleMatchChanges();
    }

    private rebuild(): void {
        this.restored = false;
        this.inputData$.next(this.createData());
    }

    private createData(): DragDropAnswersData {
        const slotData: DragDropSlotItem[] = this._slots.map(label => ({
            text: label,
            answers: []
        }));
        return {
            answers: this._variants.map(v => ({ text: v.text })),
            slots: slotData,
            dropIds: createSlotDropIds(slotData.length)
        };
    }

    private restore(data: DragDropAnswersData, matches: MatchingAnswer[]): DragDropAnswersData {
        for(const match of matches) {
            const answerIndex = data.answers.findIndex(a => a.text === match.answer);
            const slotIndex = data.slots.findIndex(s => s.text === match.slot);
            if(answerIndex >= 0 && slotIndex >= 0) {
                const answer = data.answers.splice(answerIndex, 1)[0];
                data.slots[slotIndex].answers.push(answer);
            }
        }
        return data;
    }

    private handleMatchChanges(): void {
        const data = this.data$.getValue();
        let complete = true;
        for(const slot of data.slots) {
            if(slot.answers.length === 0) {
                complete = false;
                break;
            }
        }
        const matches = data.slots
            .filter(s => s.answers.length && s.answers[0].text)
            .map(s => {
                const json: MatchingAnswer = {
                    answer: s.answers[0].text,
                    slot: s.text!
                };
                return JSON.stringify(json);
            });
        this.matchesChange.emit(matches);
        if(this.isComplete !== complete) {
            this.isComplete = complete;
            this.complete.emit(complete);
        }
    }
}
