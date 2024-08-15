import {Component} from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html'
})
export class SidebarComponent {

  constructor(private router: Router) {
  }

  goToChallengeView(): void {
    this.router.navigate(["/challenges"]);
  }

  goToChampionsView(): void {
    this.router.navigate(["/champions"]);
  }
}
