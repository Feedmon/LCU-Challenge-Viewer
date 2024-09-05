import {Injectable} from "@angular/core";
import {ChallengeControllerService} from "./challenge-controller.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";
import {Challenge, ChampionIdWithStatstones, LolChampionsCollectionsChampionSkin} from "src/backend-api/api/models";
import {Subject} from "rxjs";

@Injectable()
export class ChallengeService {

  private champSpecificChallengesNotifySubject = new Subject<void>();
  private challengesNotifySubject = new Subject<void>();
  private eternalsNotifySubject = new Subject<void>();
  private champSpecificChallenges: SpecialChallengesDto[] = [];
  private challenges: Challenge[] = [];
  private champions: Champion[] = [];
  private skins: LolChampionsCollectionsChampionSkin[] = [];
  private eternals: ChampionIdWithStatstones[] = [];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  champSpecificChallengesNotify$ = this.champSpecificChallengesNotifySubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  challengesNotify$ = this.challengesNotifySubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  eternalsNotify$ = this.eternalsNotifySubject.asObservable();

  constructor(private challengeControllerService: ChallengeControllerService) {
    this.challengeControllerService.waitForBackendConnection().subscribe({
      next: () => {
        void this.getChallenges();
        void this.getChampions();
        void this.getSkins();
        void this.getChampSpecificChallenges()
      },
      error: (err) => {
        console.error('Error while waiting for backend connection:', err);
      }
    });
  }

  getSkins(): Promise<LolChampionsCollectionsChampionSkin[]> {
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
      return Promise.resolve( this.champSpecificChallenges);
    }

    return this.challengeControllerService.getChampSpecificChallenges().then(response => {
      this.champSpecificChallenges = response;
      return response;
    });
  }

  getChallenges(): Promise<Challenge[]> {
    if(this.challenges.length !== 0){
      return Promise.resolve( this.challenges);
    }

    return this.challengeControllerService.getChallenges().then(response => {
      this.challenges = response;
      this.notifyChampSpecificChallenges();
      return response;
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
