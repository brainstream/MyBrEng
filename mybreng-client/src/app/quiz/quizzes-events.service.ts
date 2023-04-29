import { Injectable } from "@angular/core";
import { QuizDto } from "@app/web-api";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class QuizzesEventsService {
    private readonly _quizSaved$ = new Subject<QuizDto>();

    get quizSaved$(): Observable<QuizDto> {
        return this._quizSaved$.asObservable();
    }

    raiseQuizSaved(quiz: QuizDto): void {
        this._quizSaved$.next(quiz);
    }
}