import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaumigComponent} from "./baumig/baumig.component";

const routes: Routes = [
  {path: 'home', component: BaumigComponent},
  {path: 'baumig', component: BaumigComponent},
  {path: "**", redirectTo: "home"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
