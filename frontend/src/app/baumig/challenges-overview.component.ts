import {Component, OnInit} from "@angular/core";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {ChallengeService} from "../services/challenge.service";
import {Challenge} from "../../backend-api/api/models/challenge";

@Component({
  selector: 'app-challenges-overview',
  templateUrl: 'challenges-overview.component.html'
})
export class ChallengesOverviewComponent implements OnInit {

  connected: boolean;
  challenges: Challenge[];

  constructor(private challengerService: ChallengeService,
              private challengeControllerService: ChallengeControllerService) {
  }

  ngOnInit(): void {
    this.challengeControllerService.getConnectionStatus().then(resp => {
      if (resp) {
        this.getChallenges();
      }
      this.connected = resp;
    });
  }

  getChallenges(): void {
    this.challengerService.getChallenges().then(response => {
      this.challenges = response;
    });
  }
}
