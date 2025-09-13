import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatchingAnswer } from '@app/shared';
import { QuizQuestionAnswerDto, QuizQuestionAnswerEditDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';


@Component({
    selector: 'app-quiz-question-edit-form',
    templateUrl: './quiz-question-edit-form.component.html',
    styleUrls: ['./quiz-question-edit-form.component.scss'],
    standalone: false
})
export class QuizQuestionEditFormComponent {
    private questionId?: string;
    form: FormGroup;

    @Input() quizId: string;

    @Output() cancelRequested = new EventEmitter<Partial<QuizQuestionDto>>();

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
        const type = this.type;
        if (type == QuizQuestionDto.QuestionTypeEnum.Match) {
            let hasSlots = false;
            for (const answer of answers.controls) {
                if ((answer as FormGroup).controls['slot'].value) {
                    hasSlots = true;
                    break;
                }
            }
            if (!hasSlots) {
                return {
                    form: 'Хотя бы один ответ должен содержать слот'
                }
            }
        } else if (type !== QuizQuestionDto.QuestionTypeEnum.FreeText) {
            let hasCorrect: boolean = false;
            for (const answer of answers.controls) {
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

    @Input() set question(q: Partial<QuizQuestionDto>) {
        this.questionId = q.id;
        this.form.controls['text'].setValue(q.text);
        this.form.controls['type'].setValue(q.questionType);
        if (q.answers) {
            this.answers.clear();
            q.answers.forEach(a =>
                this.answers.push(this.createAnswerFormGroup(a))
            );
        }
    }

    private createAnswerFormGroup(answer?: QuizQuestionAnswerDto): FormGroup {
        let text = answer?.text ?? '';
        let slot: string | null = null;
        if (text && this.type === QuizQuestionDto.QuestionTypeEnum.Match) {
            const ma = JSON.parse(text) as MatchingAnswer;
            text = ma.answer;
            slot = ma.slot;
            console.log(text, slot);
        }
        return this.formBuilder.group({
            id: [answer?.id],
            slot: [slot],
            text: [text, Validators.required],
            isCorrect: [answer?.isCorrect ?? false]
        });
    }

    get answers(): FormArray {
        return this.form.get('answers') as FormArray;
    }

    get type(): string {
        return (this.form.get('type')?.value as string) ?? '';
    }

    isCorrect(answer: AbstractControl): boolean {
        return (answer as FormGroup).controls['isCorrect'].value as boolean;
    }

    save() {
        const questionType = this.form.controls['type'].value as QuizQuestionDto.QuestionTypeEnum;
        const getAnswer = (group: FormGroup): QuizQuestionAnswerEditDto => {
            const result: QuizQuestionAnswerEditDto   = {
                id: group.controls['id'].value ?? undefined,
                text: group.controls['text'].value as string,
                isCorrect: group.controls['isCorrect'].value as boolean
            };
            if (questionType === QuizQuestionDto.QuestionTypeEnum.Match) {
                const ma: MatchingAnswer = {
                    slot: group.controls['slot'].value as string,
                    answer: result.text
                };
                result.text = JSON.stringify(ma);
                result.isCorrect = !!ma.slot;
            }
            else if (questionType === QuizQuestionDto.QuestionTypeEnum.FreeText) {
                result.isCorrect = true;
            }
            return result;
        };
        this.saveRequested.emit({
            id: this.questionId,
            quiz_id: this.quizId,
            text: this.form.controls['text'].value,
            questionType: questionType,
            answers: this.answers.controls.map(a => getAnswer(a as FormGroup))
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
        switch (this.type) {
            case QuizQuestionDto.QuestionTypeEnum.Match:
            case QuizQuestionDto.QuestionTypeEnum.FreeText:
                return false;
            default:
                return true;
        }
    }
}
