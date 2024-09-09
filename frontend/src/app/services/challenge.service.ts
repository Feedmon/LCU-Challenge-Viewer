import {Injectable} from "@angular/core";
import {ChallengeControllerService} from "./challenge-controller.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";
import {
  Challenge,
  ChampionIdWithStatstones,
  ChampionSkin,
  Leagues
} from "src/backend-api/api/models";
import {Subject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";

@Injectable()
export class ChallengeService {

  private champSpecificChallengesNotifySubject = new Subject<void>();
  private challengesNotifySubject = new Subject<void>();
  private eternalsNotifySubject = new Subject<void>();
  private champSpecificChallenges: SpecialChallengesDto[] = [];
  private challenges: Challenge[] = [];
  private champions: Champion[] = [];
  private skins: ChampionSkin[] = [];
  private eternals: ChampionIdWithStatstones[] = [];
  private hideCompletedChallenges: boolean;
  private hideCompletedChallengesLocalStorageKey = "hideCompletedChallengesKey";

  // eslint-disable-next-line @typescript-eslint/member-ordering
  champSpecificChallengesNotify$ = this.champSpecificChallengesNotifySubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  challengesNotify$ = this.challengesNotifySubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  eternalsNotify$ = this.eternalsNotifySubject.asObservable();

  constructor(private challengeControllerService: ChallengeControllerService,
              private localStorageService: LocalStorageService) {
    this.hideCompletedChallenges = this.localStorageService.getBoolean(this.hideCompletedChallengesLocalStorageKey);

    this.challengeControllerService.waitForClientConnection().subscribe({
      next: res => {
        if(res) {
          void this.getChallenges();
          void this.getChampions();
          void this.getSkins();
          void this.getChampSpecificChallenges()
        }
      },
      error: (err) => {
        console.error('Error while waiting for backend connection:', err);
      }
    });
  }

  getHideCompletedChallenges(): boolean {
    return this.hideCompletedChallenges;
  }

  setHideCompletedChallenges(hide: boolean): void {
    this.hideCompletedChallenges = hide;
    this.localStorageService.setBoolean(this.hideCompletedChallengesLocalStorageKey, hide);
    this.notifyChallenges();
    this.notifyChampSpecificChallenges();
    this.notifyEternals();
  }

  idAvailableForChallenge(id: number, challenge: Challenge): boolean {
    if(challenge.availableIds.length === 0 && !this.isChallengeCompleted(challenge.currentLevel, challenge.nextLevel)){
      return true;
    }
    return challenge.availableIds.includes(id) || challenge.completedIds.includes(id);
  }

  getSkins(): Promise<ChampionSkin[]> {
    if(this.skins.length !== 0){
      return Promise.resolve(this.skins);
    }

    return this.challengeControllerService.getAllSkins().then(response => {
      this.skins = response;
      return response
    });
  }

 getChampions(): Promise<Champion[]> {
    if(this.champions.length !== 0){
      return Promise.resolve(this.champions);
    }

  return this.challengeControllerService.getAllChampions().then(response => {
      this.champions = response;
      return response
    });
  }

   getChampSpecificChallenges(): Promise<SpecialChallengesDto[]> {
    if(this.champSpecificChallenges.length !== 0){
      return Promise.resolve(this.filterChampSpecificChallenges(this.champSpecificChallenges));
    }

    return this.challengeControllerService.getChampSpecificChallenges().then(response => {
      this.champSpecificChallenges = response;
      return this.filterChampSpecificChallenges(response);
    });
  }

  getProgressableChampionChallenges(): Promise<Challenge[]>{
    return this.challengeControllerService.getProgressableChampionChallenges().then(challenges => this.filterChallenges(challenges));
  }

  getChallenges(): Promise<Challenge[]> {
    if(this.challenges.length !== 0){
      return Promise.resolve(this.filterChallenges(this.challenges));
    }

    return this.challengeControllerService.getChallenges().then(response => {
      this.challenges = response;
      this.notifyChampSpecificChallenges();
      this.notifyChallenges();
      return this.filterChallenges(response);
    });
  }

  getEternals(): Promise<ChampionIdWithStatstones[]> {
    if(this.eternals.length !== 0){
      return Promise.resolve( this.eternals);
    }

    return this.challengeControllerService.getEternals().then(response => {
      this.eternals = response;
      return response;
    });
  }

  reloadChallenges(): Promise<SpecialChallengesDto[]> {
    return this.challengeControllerService.reloadChallenges().then(challenges => {
      this.challenges = challenges;
      this.notifyChallenges();
      this.notifyChampSpecificChallenges();
      this.champSpecificChallenges = [];
      return this.getChampSpecificChallenges()
    })
  }

  reloadEternals(): Promise<ChampionIdWithStatstones[]> {
    return this.challengeControllerService.reloadEternals().then(eternals => {
      this.eternals = eternals;
      this.notifyEternals();
      return this.eternals;
    })
  }

  notifyChampSpecificChallenges() {
    this.champSpecificChallengesNotifySubject.next();
  }

  notifyChallenges() {
    this.challengesNotifySubject.next();
  }

  notifyEternals() {
    this.eternalsNotifySubject.next();
  }

  private filterChallenges(challenges: Challenge[]): Challenge[] {
    if(this.hideCompletedChallenges){
      return challenges.filter(chall => !this.isChallengeCompleted(chall.currentLevel, chall.nextLevel));
    }
    return challenges;
  }

 private filterChampSpecificChallenges(challenges: SpecialChallengesDto[]): SpecialChallengesDto[] {
    if(this.hideCompletedChallenges){
      return challenges.filter(chall => !this.isChallengeCompleted(chall.currentLevel, chall.nextLevel));
    }
    return challenges;
  }

  private isChallengeCompleted(currentLevel: Leagues, nextLevel: string | undefined): boolean {
    return currentLevel === Leagues.Master || currentLevel === Leagues.Grandmaster || currentLevel === Leagues.Challenger || !nextLevel;
  }
}

export function clientChampionSearchBehaviour(name: string, search: string): boolean {
  name = name.toLowerCase();
  search = search.toLowerCase();

  for (let i = 0; i < search.length; i++) {
    if(name.includes(search.charAt(i))) {
      name = name.slice(name.indexOf(search.charAt(i)) + 1);
    } else {
      return false;
    }
  }

  return true;
}
