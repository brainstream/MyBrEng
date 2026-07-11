import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        NgIf,
        FormsModule,
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatProgressSpinner,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton
    ]
})
export class LoginComponent {
    public email: string;
    public password: string;
    public loading = false;

    constructor(
        private readonly auth: AuthService,
        private readonly dialog: MatDialogRef<unknown>
    ) {
    }

    public async submit(): Promise<void> {
        this.loading = true;
        const result = await this.auth.login(this.email, this.password);
        this.loading = false;
        if(result) {
            this.dialog.close();
        }
    }
}
