import { NgModule } from '@angular/core';
import { MarkdownComponent } from './markdown.component';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from './markdown.pipe';

@NgModule({
  declarations: [
    MarkdownComponent,
    MarkdownPipe
  ],
  exports: [
    MarkdownComponent,
    MarkdownPipe
  ],
  imports: [
    CommonModule
  ]
})
export class MarkdownModule { }
