import {Component, OnInit} from "@angular/core";
import {ChallengeService} from "../services/challenge.service";
import {ChallengeControllerService} from "../services/challenge-controller.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls:['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  connected = false;
  loading = false;

  constructor(private challengeService: ChallengeService,
              private challengeControllerService: ChallengeControllerService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.challengeControllerService.waitForBackendConnection().subscribe({
      next: () => {
        this.loading = false;
        setInterval(() => {
          this.testConnection()
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error while waiting for backend connection:', err);
      }
    });
  }

  reloadChallenges(): void {
    this.loading = true;
    this.challengeService.reloadChallenges().then(()=> this.loading = false);
  }

  reloadEternals(): void {
    this.loading = true;
    this.challengeService.reloadEternals().then(()=> this.loading = false);
  }

  startConnection(): void {
   this.challengeControllerService.startConnection();
  }

  stopConnection(): void {
    this.challengeControllerService.stopConnection();
  }

  testConnection(): void {
    this.challengeControllerService.getConnectionStatus().then(resp => {
      this.connected = resp;
    });
  }

}
