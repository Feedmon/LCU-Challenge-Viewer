import {Injectable} from '@angular/core';
import {TestControllerService} from "../../backend-api/api/services/test-controller.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {
  LolChampionsCollectionsChampionSkin
} from "../../backend-api/api/models/lol-champions-collections-champion-skin";
import {Champion} from "../../backend-api/api/models/champion";
import { Challenge } from '../../backend-api/api/models/challenge';

@Injectable()
export class TestService {

  constructor(private testControllerService: TestControllerService) {
  }


  getConnectionStatus(): Promise<boolean> {
    return this.testControllerService.getLcuConnectionStatus().toPromise();
  }



  startConnection(): void{
    this.testControllerService.startConnection().toPromise();
  }

  stopConnection(): void{
    this.testControllerService.stopConnection().toPromise();
  }

  getChallenges(): Promise<SpecialChallengesDto[]> {
  return this.testControllerService.idSpecificChallenges().toPromise();
  }

    reloadChallenges(): Promise<Challenge[]> {
    return this.testControllerService.reloadChallengeData().toPromise();
    }

  getChallengeInfo(challengeName: string): Promise<SpecialChallengesDto> {
    return this.testControllerService.getChallengeInfo({challengeName}).toPromise();
  }

  getSkinForId(skinId: number): Promise<LolChampionsCollectionsChampionSkin> {
    return this.testControllerService.getSkinForId({ skinId}).toPromise();
  }

  getChampionForId(championId: number): Promise<Champion> {
    return this.testControllerService.getChampionForId({ championId}).toPromise();
  }
}
