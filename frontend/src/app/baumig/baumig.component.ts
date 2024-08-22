import {Component, OnInit} from "@angular/core";
import {ChallengeControllerService} from "../services/challenge-controller-service-wrapper.service";
import {Champion} from "../../backend-api/api/models/champion";
import {ChallengeService} from "../services/challenge.service";
import {Challenge} from "../../backend-api/api/models/challenge";

@Component({
  selector: 'app-baumig',
  templateUrl: 'baumig.component.html'
})
export class BaumigComponent implements OnInit {


  connected: boolean;
  challenges: Challenge[];
  champions: Champion[]


  constructor(private challengerService: ChallengeService,
              private testService: ChallengeControllerService) {
  }

  ngOnInit(): void {
    this.testService.getConnectionStatus().then(resp => {
      if (resp) {
        this.getChallenges();
      }
      this.connected = resp;
    });
  }

  getChallenges(): void {
    this.testService.getChallenges().then(response => {
      this.challenges = response;
    });
  }
}
