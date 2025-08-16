import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { ConfirmDialogComponent } from './confirm-dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SearchComponent } from './search';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ConfirmDialogComponent,
        SearchComponent
    ],
    imports: [
        NgCommonModule,
        FormsModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    exports: [
        SearchComponent
    ]
})
export class CommonModule {

}
