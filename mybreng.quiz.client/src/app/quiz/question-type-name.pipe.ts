import { Pipe, PipeTransform } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Pipe({
    name: 'questionTypeName',
    standalone: false
})
export class QuestionTypeNamePipe implements PipeTransform {
    transform(value: QuizQuestionDto.QuestionTypeEnum): string {
        switch (value) {
            case QuizQuestionDto.QuestionTypeEnum.SingleChoice:
                return 'Выбор единственного варианта';
            case QuizQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'Выбор нескольких вариантов';
            case QuizQuestionDto.QuestionTypeEnum.FreeText:
                return 'Ввод текста';
            default:
                return '';
        }
    }
}
