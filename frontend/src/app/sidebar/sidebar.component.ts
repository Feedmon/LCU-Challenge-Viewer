import {Component} from "@angular/core";
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private router: Router) {
  }

  goToChallengesView(): void {
    this.router.navigate(["/challenges"]);
  }

  goToChallengeAutoCheckListView(): void {
    this.router.navigate(["/challengeAutoCheckList"]);
  }

  goToChampionsToChallenges(): void {
    this.router.navigate(["/championsToChallenges"]);
  }

  goToEternalsView(): void {
    this.router.navigate(["/eternals"]);
  }
}
