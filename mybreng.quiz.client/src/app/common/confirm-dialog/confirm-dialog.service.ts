import { Injectable } from "@angular/core";
import { IConfirmationDialogData } from "./confirmation-dialog-data";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ConfirmDialogComponent } from "./confirm-dialog.component";
import { ConfirmDialogButton, IConfirmationDialogResult } from "./confirmation_dialog-result";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    constructor(private readonly bottomSheet: MatBottomSheet) {
    }

    show(data: IConfirmationDialogData): Promise<IConfirmationDialogResult> {
        return new Promise((resolve, _) => {
            const bs = this.bottomSheet.open(ConfirmDialogComponent, {
                data
            });
            const subscription = bs.afterDismissed()
                .subscribe((result: IConfirmationDialogResult | undefined) => {
                    subscription.unsubscribe();
                    resolve(result ?? {
                        button: ConfirmDialogButton.No
                    });
                });
        });
    }
}
