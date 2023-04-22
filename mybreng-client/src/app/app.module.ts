import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ThemeService } from './common';
import { appInitializerFactory } from './app-initializer-factory';
import { ApiModule } from './web-api';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth';
import { CommonModule as AppCommonModule } from '@app/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    HttpClientModule,
    AuthModule,
    ApiModule,
    AppCommonModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [
      ThemeService
    ],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
