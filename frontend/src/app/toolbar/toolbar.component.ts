import {Component, OnInit} from "@angular/core";
import {ChallengeService} from "../services/challenge.service";
import {ChallengeControllerService} from "../services/challenge-controller-service-wrapper.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls:['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  connected = false;
  loading = false;

  constructor(private challengeService: ChallengeService,
              private testService: ChallengeControllerService) {
  }

  ngOnInit(): void {
    setInterval(() => {
       this.testConnection()
    }, 100);
  }

  reloadChallenges(): void {
    this.loading = true;
    this.challengeService.reloadChallenges().then(()=> this.loading = false);
  }

  startConnection(): void {
   this.testService.startConnection();
  }

  stopConnection(): void {
    this.testService.stopConnection();
  }

  testConnection(): void {
    this.testService.getConnectionStatus().then(resp => {
      this.connected = resp;
    });
  }

}
