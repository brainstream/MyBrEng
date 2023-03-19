import { Injectable } from "@angular/core";
import { QuizService } from "@app/web-api";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs";
import { QuizzesActions } from "./quizzes-actions";

@Injectable()
export class QuizzesEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly quizService: QuizService
    ) {
    }

    loadList$ = createEffect(() => this.actions$.pipe(
        ofType(QuizzesActions.loadList),
        exhaustMap(() =>
            this.quizService.quizList()
                .pipe(
                    map(quizzes => QuizzesActions.setList({ quizzes }))
                )
        )
    ));
}
