import { Injectable } from "@angular/core";
import { QuizDto } from "@app/web-api";
import { Event } from '@app/shared';

@Injectable({
    providedIn: 'root'
})
export class QuizzesEventsService {
    readonly quizSaved$ = new Event<QuizDto>();
    readonly quizDeleted$ = new Event<{ id: string }>();
}
