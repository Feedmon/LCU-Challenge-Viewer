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
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouteParameters} from "./route-parameters";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // NoopAnimationsModule for no animations
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  providers: [
    OpenMaterialDialogService,
    RouteParameters
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconregistry: MatIconRegistry) {
    matIconregistry.setDefaultFontSetClass("fas");
  }
}
