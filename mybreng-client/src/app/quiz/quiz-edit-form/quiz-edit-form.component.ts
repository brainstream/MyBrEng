import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { QuizEditDto } from '@app/web-api';

@Component({
  selector: 'app-quiz-edit-form',
  templateUrl: './quiz-edit-form.component.html',
  styleUrls: ['./quiz-edit-form.component.scss']
})
export class QuizEditFormComponent {
  readonly quizId?: string;
  readonly form: FormGroup;

  constructor(
    fb: FormBuilder,
    private readonly bottomSheet: MatBottomSheetRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) quiz?: QuizEditDto,
  ) {
    this.quizId = quiz?.id;
    this.form = fb.group({
      title: [quiz?.title ?? '', Validators.required],
      description: [quiz?.description ?? '']
    });
  }

  cancel() {
    this.bottomSheet.dismiss();
  }

  save() {
    if (this.form.valid) {
      this.bottomSheet.dismiss({
        id: this.quizId,
        title: this.form.controls['title'].value,
        description: this.form.controls['description'].value
      } as QuizEditDto);
    }
  }
}
