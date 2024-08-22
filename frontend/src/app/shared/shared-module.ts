import {NgModule} from "@angular/core";
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {BaumigComponent} from "../baumig/baumig.component";
import {ChampionsViewComponent} from "../champions-view/champions-view.component"
import {MaterialModule} from "../material/material.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpBaseInterceptor} from "../../backend-api/interceptors/http-base-interceptor";
import {ChallengeControllerService} from "../services/challenge-controller-service-wrapper.service";
import {OpenMaterialDialogService} from "./open-material-dialog.service";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ChallengeTableOverviewComponent} from "../baumig/table/challenge-table-overview.component";
import {ChallengeViewComponent} from "../challenge-view/challenge-view.component";
import {RouterModule} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {ChallengeService} from "../services/challenge.service";
import {ChampionChallengeViewComponent} from "../champion-challenge-view/champion-challenge-view.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    BaumigComponent,
    ChampionsViewComponent,
    ChallengeTableOverviewComponent,
    ChallengeViewComponent,
    ChampionChallengeViewComponent
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
    MatListModule,
    MatIconModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true},
    ChallengeControllerService,
    ChallengeService,
    OpenMaterialDialogService,
  ],
  exports: [
    BaumigComponent,
    ChampionChallengeViewComponent,
    ChampionsViewComponent
  ]
})
export class SharedModule {
}
