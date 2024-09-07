import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChallengesOverviewComponent} from "./challenge-overview/challenges-overview.component";
import {
  ChampionsChallengeCompletionComponent
} from "./champions-challenge-completion/champions-challenge-completion.component"
import {ChallengeViewComponent} from "./challenge-overview/challenge-view/challenge-view.component";
import {RouteParameters} from "./route-parameters";
import {ChallengeAutoChecklistComponent} from "./challenge-auto-checklist/challenge-auto-checklist.component";
import {EternalsProgressionComponent} from "./eternals-progression/eternals-progression.component";
import {
  ChampionSpecificComponent
} from "./challenge-overview/challenge-view/champion-specific/champion-specific.component";
import {SkinSpecificComponent} from "./challenge-overview/challenge-view/skin-specific/skin-specific.component";
import {ItemSpecificComponent} from "./challenge-overview/challenge-view/item-specific/item-specific.component";

const routes: Routes = [
  {path: 'challenges', component: ChallengesOverviewComponent},
  {path: 'challengeAutoCheckList', component: ChallengeAutoChecklistComponent},
  {path: 'championsToChallenges', component: ChampionsChallengeCompletionComponent},
  {path: 'eternals', component: EternalsProgressionComponent},
  {path:`challenge-details/:${RouteParameters.challengeName}`,component:ChallengeViewComponent},
  {path:`skin-challenge-details/:${RouteParameters.challengeName}`,component:SkinSpecificComponent},
  {path:`champ-challenge-details/:${RouteParameters.challengeName}`,component:ChampionSpecificComponent},
  {path:`item-challenge-details/:${RouteParameters.challengeName}`,component:ItemSpecificComponent},
  {path: "**", redirectTo: "challengeAutoCheckList"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
