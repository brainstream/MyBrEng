import { ApplicationConfig, isDevMode, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideState } from '@ngrx/store';

import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { ThemeService } from './common';
import { appInitializerFactory } from './app-initializer-factory';
import { ApiModule } from './web-api';

import { goReducer } from './go/store';
import { GoEffects } from './go/store/go-effects';
import { quizzesReducer } from './quiz/store';
import { QuizzesEffects } from './quiz/store/quizzes-effects';
import { studentsReducer } from './student/store';
import { StudentsEffects } from './student/store/students-effects';
import { tagsReducer } from './tag/store';
import { TagsEffects } from './tag/store/tags-effects';
import { artifactsReducer } from './artifact/store';
import { ArtifactsEffects } from './artifact/store/artifacts-effects';

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
            const initializerFn = (appInitializerFactory)(inject(ThemeService));
            return initializerFn();
        }),
    ]
};
