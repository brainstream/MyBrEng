import { ApplicationConfig, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from '@app/app.routes';
import { authInterceptor } from '@app/auth/auth.interceptor';
import { ThemeService } from '@app/common/theme.service';
import { appInitializerFactory } from '@app/app-initializer-factory';
import { provideApi } from '@app/web-api/provide-api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        provideStore({}),
        provideEffects([]),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
        provideApi({}),
        provideAppInitializer(() => {
            const initializerFn = appInitializerFactory(inject(ThemeService));
            return initializerFn();
        })
    ]
};
