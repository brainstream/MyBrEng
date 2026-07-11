import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type MessageType = 'error' | 'info';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private readonly snack: MatSnackBar) {
    }

    public showError(message: string): void {
        this.show('error', message);
    }

    public showInfo(message: string): void {
        this.show('info', message);
    }

    public show(type: MessageType, message: string): void {
        this.snack.open(message, 'OK', {
            panelClass: ['system-message', `system-message__${type}`]
        });
    }
}
