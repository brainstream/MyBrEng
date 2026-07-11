import { ConfirmDialogButton } from './confirmation_dialog-result';

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
