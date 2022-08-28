import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {MaterialModule} from "./material/material.module";
import {MatIconRegistry} from "@angular/material/icon";
import {SharedModule} from "./shared/shared-module";
import {OpenMaterialDialogService} from "./shared/open-material-dialog.service";
import {CreateClassComponent} from './create-class/create-class/create-class.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CreateClassComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // NoopAnimationsModule for no animations
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
  ],
  providers: [
    OpenMaterialDialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconregistry: MatIconRegistry) {
    matIconregistry.setDefaultFontSetClass("fas");
  }
}
