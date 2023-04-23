import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type MessageType = 'error' | 'info';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private readonly snack: MatSnackBar) { }

  showError(message: string) {
    this.show('error', message);
  }

  showInfo(message: string) {
    this.show('info', message);
  }

  show(type: MessageType, message: string) {
    this.snack.open(message, 'OK', {
      panelClass: ['system-message', `system-message__${type}`]
    });
  }
}
