import { ConfirmDialogButton } from "./confirmation_dialog-result";
import { MatIcon } from '@angular/material/icon'

export interface IConfirmationDialogButtonConfiguration {
    text?: string;
    icon?: string;
    color?: 'primary' | 'accent' | 'warn' | 'default';
}

export interface IConfirmationDialogData {
    text: string;
    buttons?: {
        yes?: IConfirmationDialogButtonConfiguration;
        no?: IConfirmationDialogButtonConfiguration;
        primary?: ConfirmDialogButton;
    }
}
