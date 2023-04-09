import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { QuizEditDto } from '@app/web-api';

@Component({
  selector: 'app-quiz-edit-form',
  templateUrl: './quiz-edit-form.component.html',
  styleUrls: ['./quiz-edit-form.component.scss']
})
export class QuizEditFormComponent {
  title: string;
  description: string;

  constructor(
    private readonly bottomSheet:  MatBottomSheetRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) quiz?: QuizEditDto
  ) {
    this.title = quiz?.title ?? '';
    this.description = quiz?.description ?? '';
  }

  cancel() {
    this.bottomSheet.dismiss();
  }

  save() {
    this.bottomSheet.dismiss({
      title: this.title,
      description: this.description
    });
  }
}
