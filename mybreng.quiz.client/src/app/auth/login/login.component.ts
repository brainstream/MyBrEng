import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [NgIf, FormsModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule]
})
export class LoginComponent {
    email: string;
    password: string;
    loading: boolean = false;

    constructor(
        private readonly auth: AuthService,
        private readonly dialog: MatDialogRef<any>
    ) {
    }

    async submit() {
        this.loading = true;
        const result = await this.auth.login(this.email, this.password);
        this.loading = false;
        if (result) {
            this.dialog.close();
        }
    }
}
