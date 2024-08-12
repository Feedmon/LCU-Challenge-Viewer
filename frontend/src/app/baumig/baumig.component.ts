import {Component, OnInit} from "@angular/core";
import {TestService} from "../services/test.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";

@Component({
  selector: 'app-baumig',
  templateUrl: 'baumig.component.html'
})
export class BaumigComponent implements OnInit {


  status = "";
  challenges: SpecialChallengesDto[];


  constructor(private testService: TestService) {
  }

  ngOnInit(): void {
    this.testService.getConnectionStatus().then(resp => {
      if (!resp) {
        this.status = "Not Connected";
      } else {
        this.getChallenges();
        this.status = "Connected";
      }
    });
  }


  testConnection(): void {
    this.testService.getConnectionStatus().then(resp => {
      if (!resp) {
        this.status = "Not Connected";
      } else {
        this.status = "Connected";
      }
    });
  }

  getChallenges(): void {
    this.testService.getChallenges().then(response => {
      this.challenges = response;
    });
  }

    reloadChallenges(): void {
      this.testService.reloadChallenges().then(response => {
      this.getChallenges()
      });
    }

  startConnection(): void {
    this.testService.startConnection();
  }

  stopConnection(): void {
    this.testService.stopConnection();
  }
}
