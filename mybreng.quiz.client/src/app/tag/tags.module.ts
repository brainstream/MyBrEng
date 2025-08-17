import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag';
import { TagPaneComponent } from './tag-pane';
import { StoreModule } from '@ngrx/store';
import { TagsEffects, TagsEventsService, tagsReducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { TagRoutingModule } from './tag-routing.module';
import { TagListComponent } from './tag-list';
import { LayoutModule } from '@app/layout';
import { MatListModule } from '@angular/material/list';
import { TagListItemComponent } from './tag-list-item';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { TagEditFormComponent } from './tag-edit-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxColorsModule } from 'ngx-colors';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        TagComponent,
        TagPaneComponent,
        TagListComponent,
        TagListItemComponent,
        TagEditFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('tags', tagsReducer),
        EffectsModule.forFeature([
            TagsEffects
        ]),
        LayoutModule,
        MatListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatBottomSheetModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTooltipModule,
        NgxColorsModule
    ],
    exports: [
        TagRoutingModule,
        TagComponent,
        TagPaneComponent
    ],
    providers: [
        TagsEventsService
    ]
})
export class TagModule { }
