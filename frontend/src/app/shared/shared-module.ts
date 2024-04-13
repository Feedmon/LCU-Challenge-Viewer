import {NgModule} from "@angular/core";
import {BaumigComponent} from "../baumig/baumig.component";
import {MaterialModule} from "../material/material.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpBaseInterceptor} from "../../backend-api/interceptors/http-base-interceptor";
import {TestService} from "../services/test.service";
import {OpenMaterialDialogService} from "./open-material-dialog.service";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {NgForOf, NgIf} from "@angular/common";
import {ChallengeTableOverviewComponent} from "../baumig/table/challenge-table-overview.component";
import {ChallengeViewComponent} from "../challenge-view/challenge-view.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    BaumigComponent,
    ChallengeTableOverviewComponent,
    ChallengeViewComponent
  ],
  imports: [
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    NgIf,
    NgForOf,
    RouterModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true},
    TestService,
    OpenMaterialDialogService,
  ],
  exports: [
    BaumigComponent,
  ]
})
export class SharedModule {
}
