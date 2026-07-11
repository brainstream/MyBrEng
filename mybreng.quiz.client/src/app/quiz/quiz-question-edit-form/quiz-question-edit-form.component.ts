import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { MatchingAnswer, parseMatchingAnswer } from '@app/shared';
import { QuizQuestionAnswerDto, QuizQuestionAnswerEditDto, QuizQuestionDto, QuizQuestionEditDto } from '@app/web-api';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { QuestionTypeNamePipe } from '../question-type-name.pipe';


@Component({
    selector: 'app-quiz-question-edit-form',
    templateUrl: './quiz-question-edit-form.component.html',
    styleUrls: ['./quiz-question-edit-form.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCard,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatSelect,
        MatInput,
        MatOption,
        MatCheckbox,
        MatPrefix,
        MatSuffix,
        MatIconButton,
        MatTooltip,
        MatIcon,
        MatButton,
        NgFor,
        NgIf,
        QuestionTypeNamePipe
    ]
})
export class QuizQuestionEditFormComponent {
    public form: FormGroup;
    @Input() public quizId: string;
    @Output() public cancelRequested = new EventEmitter<Partial<QuizQuestionDto>>();
    @Output() public saveRequested = new EventEmitter<QuizQuestionEditDto>();
    private questionId?: string;

    constructor(private readonly formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            text: [Validators.required],
            type: [Validators.required],
            answers: formBuilder.array([])
        });
        this.form.addValidators(_ => this.validateForm());
    }

    @Input() public set question(q: Partial<QuizQuestionDto>) {
        this.questionId = q.id;
        this.form.controls['text'].setValue(q.text);
        this.form.controls['type'].setValue(q.questionType);
        if(q.answers) {
            this.answers.clear();
            q.answers.forEach(a =>
                this.answers.push(this.createAnswerFormGroup(a)));
        }
    }

    public get answers(): FormArray {
        return this.form.get('answers') as FormArray;
    }

    public get type(): string {
        return this.form.get('type')?.value as string;
    }

    public get questionTypes(): QuizQuestionDto.QuestionTypeEnum[] {
        return Object.values(QuizQuestionDto.QuestionTypeEnum);
    }

    public get canAnswersBeMarkedAsCorrect(): boolean {
        switch(this.type) {
            case QuizQuestionDto.QuestionTypeEnum.Match:
            case QuizQuestionDto.QuestionTypeEnum.FreeText:
                return false;
            default:
                return true;
        }
    }

    public isCorrect(answer: AbstractControl): boolean {
        return (answer as FormGroup).controls['isCorrect'].value as boolean;
    }

    public save(): void {
        const questionType = this.form.controls['type'].value as QuizQuestionDto.QuestionTypeEnum;
        const getAnswer = (group: FormGroup): QuizQuestionAnswerEditDto => {
            const result: QuizQuestionAnswerEditDto = {
                id: group.controls['id'].value as string || undefined,
                text: group.controls['text'].value as string,
                isCorrect: group.controls['isCorrect'].value as boolean
            };
            if(questionType === QuizQuestionDto.QuestionTypeEnum.Match) {
                const ma: MatchingAnswer = {
                    slot: group.controls['slot'].value as string,
                    answer: result.text
                };
                result.text = JSON.stringify(ma);
                result.isCorrect = !!ma.slot;
            } else if(questionType === QuizQuestionDto.QuestionTypeEnum.FreeText) {
                result.isCorrect = true;
            }
            return result;
        };
        this.saveRequested.emit({
            id: this.questionId,
            quiz_id: this.quizId,
            text: this.form.controls['text'].value as string,
            questionType: questionType,
            answers: this.answers.controls.map(a => getAnswer(a as FormGroup))
        });
    }

    public cancel(): void {
        this.cancelRequested.emit(this.question);
    }

    public addAnswer(): void {
        this.answers.push(this.createAnswerFormGroup());
    }

    public deleteAnswer(index: number): void {
        this.answers.removeAt(index);
    }

    private validateForm(): ValidationErrors | null {
        const answers = this.answers;
        if(answers.length === 0) {
            return {
                form: 'Вопрос должен содержать хотя бы один ответ'
            };
        }
        const type = this.type;
        if(type === QuizQuestionDto.QuestionTypeEnum.Match) {
            let hasSlots = false;
            for(const answer of answers.controls) {
                if((answer as FormGroup).controls['slot'].value) {
                    hasSlots = true;
                    break;
                }
            }
            if(!hasSlots) {
                return {
                    form: 'Хотя бы один ответ должен содержать слот'
                };
            }
        } else if(type !== QuizQuestionDto.QuestionTypeEnum.FreeText) {
            let hasCorrect = false;
            for(const answer of answers.controls) {
                if((answer as FormGroup).controls['isCorrect'].value as boolean) {
                    hasCorrect = true;
                    break;
                }
            }
            if(!hasCorrect) {
                return {
                    form: 'Хотя бы один ответ должен быть помечен как верный'
                };
            }
        }
        return null;
    }

    private createAnswerFormGroup(answer?: QuizQuestionAnswerDto): FormGroup {
        let text = answer?.text ?? '';
        let slot: string | null = null;
        if(text && this.type === QuizQuestionDto.QuestionTypeEnum.Match) {
            const ma = parseMatchingAnswer(text);
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
}
