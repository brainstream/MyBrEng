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
            const poolIndex = event.previousIndex;
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                poolIndex,
                0
            );
            transferArrayItem(
                event.container.data,
                event.previousContainer.data,
                1,
                poolIndex
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
}
