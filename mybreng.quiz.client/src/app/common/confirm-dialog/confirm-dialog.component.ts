import { Component, Inject } from '@angular/core';
import { IConfirmationDialogData } from './confirmation-dialog-data';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ConfirmDialogButton, IConfirmationDialogResult } from './confirmation_dialog-result';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';


@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    imports: [MatButton, MatIcon, MatDivider]
})
export class ConfirmDialogComponent {
    public readonly text: string;
    public readonly primaryButton: ConfirmDialogButton;
    public readonly yesText: string;
    public readonly noText: string;
    public readonly yesIcon: string;
    public readonly noIcon: string;
    public readonly yesColor: string;
    public readonly noColor: string;

    constructor(
        private readonly bottomSheet: MatBottomSheetRef,
        @Inject(MAT_BOTTOM_SHEET_DATA) data: IConfirmationDialogData
    ) {
        this.text = data.text;
        this.primaryButton = data.buttons?.primary ?? ConfirmDialogButton.Yes;
        this.yesText = data.buttons?.yes?.text ?? 'Да';
        this.noText = data.buttons?.no?.text ?? 'Нет';
        this.yesIcon = data.buttons?.yes?.icon ?? 'done';
        this.noIcon = data.buttons?.no?.icon ?? 'close';
        this.yesColor = data.buttons?.yes?.color ?? (
            this.primaryButton === ConfirmDialogButton.Yes ? 'accent' : 'default'
        );
        this.noColor = data.buttons?.no?.color ?? (
            this.primaryButton === ConfirmDialogButton.No ? 'accent' : 'default'
        );
    }

    public yes(): void {
        this.bottomSheet.dismiss(this.makeResult(ConfirmDialogButton.Yes));
    }

    public no(): void {
        this.bottomSheet.dismiss(this.makeResult(ConfirmDialogButton.No));
    }

    private makeResult(button: ConfirmDialogButton): IConfirmationDialogResult {
        return { button };
    }
}
