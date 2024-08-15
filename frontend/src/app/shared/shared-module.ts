import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import {BaumigComponent} from "../baumig/baumig.component";
import {ChampionsViewComponent} from "../champions-view/champions-view.component"
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
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {ChallengeService} from "../services/challenge.service";

@NgModule({
  declarations: [
    BaumigComponent,
    ChampionsViewComponent,
    ChallengeTableOverviewComponent,
    ChallengeViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    NgIf,
    NgForOf,
    RouterModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true},
    TestService,
    ChallengeService,
    OpenMaterialDialogService,
  ],
  exports: [
    BaumigComponent,
    ChampionsViewComponent
  ]
})
export class SharedModule {
}
