import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFilterPanelComponent } from './list-filter-panel';
import { ApiModule } from '@app/web-api';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    declarations: [
        ListFilterPanelComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        NgxMatSelectSearchModule
    ],
    exports: [
        ListFilterPanelComponent
    ]
})
export class ListFilterModule { }
