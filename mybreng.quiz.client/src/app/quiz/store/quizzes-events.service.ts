import { Injectable } from "@angular/core";
import { QuizDto, QuizQuestionDto } from "@app/web-api";
import { Event } from '@app/shared';

@Injectable()
export class QuizzesEventsService {
    readonly quizSaved$ = new Event<QuizDto>();
    readonly quizDeleted$ = new Event<{ id: string }>();
    readonly questionSaved$ = new Event<{ question: QuizQuestionDto }>();
    readonly questionsReordered$ = new Event<{ questions: QuizQuestionDto[] }>();
}
