import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
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
