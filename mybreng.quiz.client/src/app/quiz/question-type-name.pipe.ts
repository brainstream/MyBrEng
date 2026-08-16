import { Pipe, PipeTransform } from '@angular/core';
import { QuizQuestionDto } from '@app/web-api';

@Pipe({
    name: 'questionTypeName'
})
export class QuestionTypeNamePipe implements PipeTransform {
    public transform(value: QuizQuestionDto.QuestionTypeEnum): string {
        switch(value) {
            case QuizQuestionDto.QuestionTypeEnum.SingleChoice:
                return 'Выбор единственного варианта';
            case QuizQuestionDto.QuestionTypeEnum.MultipleChoice:
                return 'Выбор нескольких вариантов';
            case QuizQuestionDto.QuestionTypeEnum.FreeText:
                return 'Ввод текста';
            case QuizQuestionDto.QuestionTypeEnum.Match:
                return 'Сопоставление выражений';
            case QuizQuestionDto.QuestionTypeEnum.WordFromLetters:
                return 'Составление слова из букв';
            default:
                throw new Error(`Unexpected question type: ${value as never}`);
        }
    }
}
