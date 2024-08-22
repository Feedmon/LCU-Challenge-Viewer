import {Injectable} from '@angular/core';
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {
  LolChampionsCollectionsChampionSkin
} from "../../backend-api/api/models/lol-champions-collections-champion-skin";
import {Champion} from "../../backend-api/api/models/champion";
import {Challenge} from '../../backend-api/api/models/challenge';
import {LcuControllerService} from "../../backend-api/api/services/lcu-controller.service";

@Injectable()
export class ChallengeControllerService {

  constructor(private lcuControllerService: LcuControllerService) {
  }


  getConnectionStatus(): Promise<boolean> {
    return this.lcuControllerService.getLcuConnectionStatus().toPromise();
  }

  startConnection(): Promise<void>{
   return this.lcuControllerService.startConnection().toPromise();
  }

  stopConnection(): Promise<void>{
   return this.lcuControllerService.stopConnection().toPromise();
  }

  getChampSpecificChallenges(): Promise<SpecialChallengesDto[]> {
    return this.lcuControllerService.champSpecificChallenges().toPromise();
  }

  getChallenges(): Promise<Challenge[]> {
    return this.lcuControllerService.getChallenges().toPromise();
  }

  reloadChallenges(): Promise<Challenge[]> {
    return this.lcuControllerService.reloadChallengeData().toPromise();
  }

  getChallengeInfo(challengeName: string): Promise<Challenge> {
    return this.lcuControllerService.getChallengeInfo({challengeName}).toPromise();
  }

  getProgressableChampionChallenges(): Promise<Challenge[]>{
    return this.lcuControllerService.getProgressableChampionChallenges().toPromise();
  }

  getAllSkins(): Promise<LolChampionsCollectionsChampionSkin[]> {
    return this.lcuControllerService.getAllSkins().toPromise();
  }

  getAllChampions(): Promise<Champion[]> {
    return this.lcuControllerService.getAllChampions().toPromise();
  }
}
