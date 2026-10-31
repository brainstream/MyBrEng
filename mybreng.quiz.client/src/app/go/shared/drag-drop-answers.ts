import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

export interface DragDropAnswerItem {
    text: string;
}

export interface DragDropSlotItem {
    answers: DragDropAnswerItem[];
    text?: string;
}

export interface DragDropAnswersData {
    answers: DragDropAnswerItem[];
    slots: DragDropSlotItem[];
    dropIds: string[];
}

export function createSlotDropIds(slotCount: number): string[] {
    const dropIds: string[] = ['answer-list'];
    for(let i = 0; i < slotCount; ++i) {
        dropIds.push(`slot-${i}`);
    }
    return dropIds;
}

export function handleDragDropSlotTransfer(
    event: CdkDragDrop<DragDropAnswerItem[]>
): void {
    const fromSlot = event.previousContainer.id.startsWith('slot-');
    const toSlot = event.container.id.startsWith('slot-');
    if(toSlot) {
        if(event.container.data.length > 0) {
            return;
        }
        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            0
        );
    } else if(fromSlot) {
        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );
    } else {
        if(!event.isPointerOverContainer) {
            return;
        }
        moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );
    }
}
