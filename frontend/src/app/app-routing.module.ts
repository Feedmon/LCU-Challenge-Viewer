import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaumigComponent} from "./baumig/baumig.component";
import {ChampionsViewComponent} from "./champions-view/champions-view.component"
import {ChallengeViewComponent} from "./challenge-view/challenge-view.component";
import {RouteParameters} from "./route-parameters";

const routes: Routes = [
  {path: 'home', component: BaumigComponent},
  {path: 'challenges', component: BaumigComponent},
  {path: 'champions', component: ChampionsViewComponent},
  {path:`challenge-details/:${RouteParameters.challengeName}`,component:ChallengeViewComponent},
  {path:`skin-challenge-details/:${RouteParameters.challengeName}`,component:ChallengeViewComponent},
  {path:`champ-challenge-details/:${RouteParameters.challengeName}`,component:ChallengeViewComponent},
  {path: "**", redirectTo: "home"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
