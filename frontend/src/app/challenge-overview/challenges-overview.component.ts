import {Component, OnDestroy, OnInit} from "@angular/core";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {ChallengeService} from "../services/challenge.service";
import {Challenge} from "../../backend-api/api/models/challenge";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-challenges-overview',
  templateUrl: 'challenges-overview.component.html'
})
export class ChallengesOverviewComponent implements OnInit, OnDestroy {

  connected: boolean;
  challenges: Challenge[];

  private subscription: Subscription = new Subscription();

  constructor(private challengeService: ChallengeService,
              private challengeControllerService: ChallengeControllerService) {
  }

  ngOnInit(): void {
    this.challengeControllerService.getConnectionStatus().then(resp => {
      if (resp) {
        this.getChallenges();
      }
      this.connected = resp;
    });

    this.subscription.add(this.challengeService.challengesNotify$.subscribe(()=> this.getChallenges()));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getChallenges(): void {
    this.challengeService.getChallenges().then(response => {
      this.challenges = response;
    });
  }
}
