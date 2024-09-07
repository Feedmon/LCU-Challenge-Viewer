import {Injectable} from '@angular/core';
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";
import {Challenge} from '../../backend-api/api/models/challenge';
import {LcuControllerService} from "../../backend-api/api/services/lcu-controller.service";
import {ChampionIdWithStatstones} from "../../backend-api/api/models/champion-id-with-statstones";
import {from, interval, Observable, of} from "rxjs";
import {catchError, filter, map, switchMap, takeWhile, timeout} from "rxjs/operators";
import {ChampionSkin, IngameItem} from 'src/backend-api/api/models';

@Injectable()
export class ChallengeControllerService {

  constructor(private lcuControllerService: LcuControllerService) {
  }

  waitForBackendStart(): Observable<boolean> {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 2);
    return interval(1000).pipe(
      switchMap(() => from(this.checkBackendStatus())),
      takeWhile(isUp => !isUp, true),
      timeout(currentDate)
    );
  }

  checkBackendStatus(): Promise<boolean> {
    return this.lcuControllerService.isBackendRunning().pipe(
      map(resp => resp),
      catchError(() => of(false))).toPromise();
  }

  waitForClientConnection(): Observable<boolean> {
    return interval(500).pipe(
      switchMap(() => from(this.getConnectionStatus())),
      filter(condition => condition === true),
      takeWhile(condition => !condition, true)
    );
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

  reloadEternals(): Promise<ChampionIdWithStatstones[]> {
    return this.lcuControllerService.reloadStatstoneData().toPromise();
  }

  getChallengeInfo(challengeName: string): Promise<Challenge> {
    return this.lcuControllerService.getChallengeInfo({challengeName}).toPromise();
  }

  getProgressableChampionChallenges(): Promise<Challenge[]>{
    return this.lcuControllerService.getProgressableChampionChallenges().toPromise();
  }

  getAllSkins(): Promise<ChampionSkin[]> {
    return this.lcuControllerService.getAllSkins().toPromise();
  }

  getAllItems(): Promise<IngameItem[]> {
    return this.lcuControllerService.getAllItems().toPromise();
  }

  getAllChampions(): Promise<Champion[]> {
    return this.lcuControllerService.getAllChampions().toPromise();
  }

  getEternals(): Promise<ChampionIdWithStatstones[]> {
    return this.lcuControllerService.getStatstones().toPromise();
  }
}
