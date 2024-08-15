import {Component, OnInit} from "@angular/core";
import {TestService} from "../services/test.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";
import {ChallengeService} from "../services/challenge.service";

@Component({
  selector: 'app-baumig',
  templateUrl: 'baumig.component.html'
})
export class BaumigComponent implements OnInit {


  connected: boolean;
  challenges: SpecialChallengesDto[];
  champions: Champion[]


  constructor(private challengerService: ChallengeService,
              private testService: TestService) {
  }

  ngOnInit(): void {
    this.testService.getConnectionStatus().then(resp => {
      if (resp) {
        this.getChallenges();
      }
      this.connected = resp;
    });
  }


  testConnection(): void {
    this.testService.getConnectionStatus().then(resp => {
      this.connected = resp;
    });
  }

  getChallenges(): void {
    this.testService.getChallenges().then(response => {
      this.challenges = response;
    });
  }
}
