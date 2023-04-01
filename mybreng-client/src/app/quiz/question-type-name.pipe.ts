import { Pipe, PipeTransform } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Pipe({
  name: 'questionTypeName'
})
export class QuestionTypeNamePipe implements PipeTransform {
  transform(value: QuizQuestionDto.TypeEnum): string {
    switch (value) {
      case QuizQuestionDto.TypeEnum.SingleChoice:
        return 'Выбор единственного варианта';
      case QuizQuestionDto.TypeEnum.MultipleChoice:
        return 'Выбор нескольких вариантов';
      case QuizQuestionDto.TypeEnum.FreeText:
        return 'Ввод текста';
      default:
        return '';
    }
  }
}
