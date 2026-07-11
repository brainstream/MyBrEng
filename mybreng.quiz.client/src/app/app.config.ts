import { ApplicationConfig, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from '@app/app.routes';
import { authInterceptor } from '@app/auth';
import { ThemeService } from '@app/common';
import { appInitializerFactory } from '@app/app-initializer-factory';
import { ApiModule } from '@app/web-api';
import { GoEffects, goReducer } from '@app/go';
import { quizzesReducer, QuizzesEffects } from '@app/quiz';
import { StudentsEffects, studentsReducer } from '@app/student';
import { tagsReducer, TagsEffects } from '@app/tag';
import { artifactsReducer, ArtifactsEffects } from '@app/artifact';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        provideStore({}),
        provideEffects([]),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
        provideState('go', goReducer),
        provideEffects([GoEffects]),
        provideState('quizzes', quizzesReducer),
        provideEffects([QuizzesEffects]),
        provideState('students', studentsReducer),
        provideEffects([StudentsEffects]),
        provideState('tags', tagsReducer),
        provideEffects([TagsEffects]),
        provideState('artifacts', artifactsReducer),
        provideEffects([ArtifactsEffects]),
        ApiModule,
        provideAppInitializer(() => {
            const initializerFn = appInitializerFactory(inject(ThemeService));
            return initializerFn();
        })
    ]
};
