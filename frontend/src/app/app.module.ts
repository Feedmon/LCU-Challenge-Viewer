import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TestService} from "./services/test.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpBaseInterceptor} from "../backend-api/interceptors/http-base-interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true},
    TestService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
