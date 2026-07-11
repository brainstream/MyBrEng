import { Injectable } from '@angular/core';
import { QuizDto, QuizQuestionDto } from '@app/web-api';
import { Event } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class QuizzesEventsService {
    public readonly quizSaved$ = new Event<QuizDto>();
    public readonly quizDeleted$ = new Event<{ id: string }>();
    public readonly questionSaved$ = new Event<{ question: QuizQuestionDto }>();
    public readonly questionCloned$ = new Event<{ question: QuizQuestionDto }>();
    public readonly questionsReordered$ = new Event<{ questions: QuizQuestionDto[] }>();
}
