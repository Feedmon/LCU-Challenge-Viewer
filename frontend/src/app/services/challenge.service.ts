import {Injectable} from "@angular/core";
import {TestService} from "./test.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";

@Injectable()
export class ChallengeService {

  private challenges: SpecialChallengesDto[] = [];
  private champions: Champion[] = [];

  constructor(private testService: TestService) {
    this.testService.getConnectionStatus().then(resp => {
      if (resp) {
        this.getChallenges();
        this.getChampions();
      }
    });
  }

 getChampions(): Promise<Champion[]> {
    if(this.champions.length === 0){
      return Promise.resolve(this.champions);
    }

  return this.testService.getAllChampions().then(response => {
      this.champions = response;
      return response
    });
  }

   getChallenges(): Promise<SpecialChallengesDto[]> {
    if(this.challenges.length ===0){
      return Promise.resolve( this.challenges);
    }

    return  this.testService.getChallenges().then(response => {
      this.challenges = response;
      return response;
    });
  }

  reloadChallenges(): void {
    this.challenges = [];
    this.getChallenges();
  }

}
