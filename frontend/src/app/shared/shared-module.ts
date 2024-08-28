import {NgModule} from "@angular/core";
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {ChallengesOverviewComponent} from "../challenge-overview/challenges-overview.component";
import {
  ChampionsChallengeCompletionComponent
} from "../champions-challenge-completion/champions-challenge-completion.component"
import {MaterialModule} from "../material/material.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpBaseInterceptor} from "../../backend-api/interceptors/http-base-interceptor";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {OpenMaterialDialogService} from "./open-material-dialog.service";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ChallengeTableOverviewComponent} from "../challenge-overview/table/challenge-table-overview.component";
import {ChallengeViewComponent} from "../challenge-overview/challenge-view/challenge-view.component";
import {RouterModule} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {ChallengeService} from "../services/challenge.service";
import {ChallengeAutoChecklistComponent} from "../challenge-auto-checklist/challenge-auto-checklist.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {EternalsProgressionComponent} from "../eternals-progression/eternals-progression.component";
import {MatTabsModule} from "@angular/material/tabs";
import {EternalSeriesTableComponent} from "../eternals-progression/eternal-series-table/eternal-series-table.component";

@NgModule({
  declarations: [
    ChallengesOverviewComponent,
    ChampionsChallengeCompletionComponent,
    ChallengeTableOverviewComponent,
    ChallengeViewComponent,
    ChallengeAutoChecklistComponent,
    EternalsProgressionComponent,
    EternalSeriesTableComponent
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
        MatTabsModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true},
    ChallengeControllerService,
    ChallengeService,
    OpenMaterialDialogService,
  ],
  exports: [
    ChallengesOverviewComponent,
    ChallengeAutoChecklistComponent,
    ChampionsChallengeCompletionComponent,
    EternalsProgressionComponent
  ]
})
export class SharedModule {
}
