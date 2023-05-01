import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';


@Component({
    selector: 'app-quiz-question-edit-form',
    templateUrl: './quiz-question-edit-form.component.html',
    styleUrls: ['./quiz-question-edit-form.component.scss']
})
export class QuizQuestionEditFormComponent {
    private questionId?: string;
    form: FormGroup;

    @Input() quizId: string;

    @Output() cancelRequested = new EventEmitter<QuizQuestionDto>();

    @Output() saveRequested = new EventEmitter<QuizQuestionEditDto>();


    constructor(private readonly formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            text: [Validators.required],
            type: [Validators.required],
            answers: formBuilder.array([])
        });
        this.form.addValidators(_ => this.validateForm());
    }

    private validateForm(): ValidationErrors | null {
        const answers = this.answers;
        if (answers.length === 0) {
            return {
                form: 'Вопрос должен содержать хотя бы один ответ'
            };
        }
        const type = this.form.controls['type'].value as QuizQuestionDto.QuestionTypeEnum;
        if (type !== 'FREE_TEXT') {
            let hasCorrect: boolean = false;
            for (let answer of answers.controls) {
                if ((answer as FormGroup).controls['isCorrect'].value as boolean) {
                    hasCorrect = true;
                    break;
                }
            }
            if (!hasCorrect) {
                return {
                    form: 'Хотя бы один ответ должен быть помечен как верный'
                };
            }
        }
        return null;
    }

    @Input() set question(q: QuizQuestionDto) {
        this.questionId = q.id;
        this.form.controls['text'].setValue(q.text);
        this.form.controls['type'].setValue(q.question_type);
        if (q.answers) {
            this.answers.clear();
            q.answers.forEach(a =>
                this.answers.push(this.createAnswerFormGroup(a.id, a.text, a.is_correct))
            );
        }
    }

    private createAnswerFormGroup(id?: string, text?: string, isCorrect?: boolean): FormGroup {
        return this.formBuilder.group({
            id: [id],
            text: [text ?? '', Validators.required],
            isCorrect: [isCorrect ?? false]
        });
    }

    get answers(): FormArray {
        return this.form.get('answers') as FormArray;
    }

    isCorrect(answer: AbstractControl): boolean {
        return (answer as FormGroup).controls['isCorrect'].value as boolean;
    }

    save() {
        const questionType = this.form.controls['type'].value as QuizQuestionDto.QuestionTypeEnum;
        this.saveRequested.emit({
            id: this.questionId,
            quiz_id: this.quizId,
            text: this.form.controls['text'].value,
            question_type: questionType,
            answers: this.answers.controls.map(a => {
                const fotmGroup = a as FormGroup;
                return {
                    id: fotmGroup.controls['id'].value ?? undefined,
                    is_correct: fotmGroup.controls['isCorrect'].value as boolean,
                    text: fotmGroup.controls['text'].value as string
                };
            })
        });
    }

    cancel() {
        this.cancelRequested.emit(this.question);
    }

    addAnswer() {
        this.answers.push(this.createAnswerFormGroup());
    }

    deleteAnswer(index: number) {
        this.answers.removeAt(index);
    }

    get questionTypes(): QuizQuestionDto.QuestionTypeEnum[] {
        return Object.values(QuizQuestionDto.QuestionTypeEnum);
    }

    get canAnswersBeMarkedAsCorrect(): boolean {
        const questionType = this.form.controls['type'].value as QuizQuestionDto.QuestionTypeEnum;
        return questionType != QuizQuestionDto.QuestionTypeEnum.FreeText;
    }
}
