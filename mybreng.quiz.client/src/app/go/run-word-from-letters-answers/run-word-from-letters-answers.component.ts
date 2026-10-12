import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RunAnswerVariantDto } from '@app/web-api';
import { BehaviorSubject } from 'rxjs';
import {
    createSlotDropIds,
    DragDropAnswersData,
    DragDropAnswerItem,
    DragDropSlotItem,
    handleDragDropSlotTransfer
} from '../shared';

@Component({
    selector: 'app-run-word-from-letters-answers',
    templateUrl: './run-word-from-letters-answers.component.html',
    styleUrl: './run-word-from-letters-answers.component.scss',
    imports: [DragDropModule]
})
export class RunWordFromLettersAnswersComponent {
    public readonly data$ = new BehaviorSubject<DragDropAnswersData>({
        answers: [],
        slots: [],
        dropIds: []
    });
    @Output() public readonly answersChange = new EventEmitter<string[]>();
    @Output() public readonly complete = new EventEmitter<boolean>();
    private isComplete = false;
    private _answers: string[] = [];
    private _variants: RunAnswerVariantDto[] = [];
    private _slotCount = 0;

    @Input() public set variants(variants: RunAnswerVariantDto[]) {
        this._variants = variants;
        this.rebuild();
    }

    @Input() public set slotCount(slotCount: number) {
        this._slotCount = slotCount;
        this.rebuild();
    }

    @Input() public set answers(words: string[]) {
        this._answers = words;
        this.rebuild();
    }

    public drop(event: CdkDragDrop<DragDropAnswerItem[]>): void {
        handleDragDropSlotTransfer(event);
        this.handleAnswersChanges();
    }

    private rebuild(): void {
        const data = this.createData();
        this.restore(data, this._answers);
        this.data$.next(data);
    }

    private createData(): DragDropAnswersData {
        const slots: DragDropSlotItem[] = [];
        for(let i = 0; i < this._slotCount; ++i) {
            slots.push({
                answers: []
            });
        }
        return {
            answers: this._variants.map(v => ({ text: v.text })),
            slots,
            dropIds: createSlotDropIds(slots.length)
        };
    }

    private restore(data: DragDropAnswersData, words: string[]): DragDropAnswersData {
        const word = words.length > 0 ? words[0] : '';
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
