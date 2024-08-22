import {Injectable} from "@angular/core";
import {ChallengeControllerService} from "./challenge-controller-service-wrapper.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";
import {Challenge, LolChampionsCollectionsChampionSkin} from "src/backend-api/api/models";
import {Subject} from "rxjs";

@Injectable()
export class ChallengeService {

  private champSpecificChallengesNotifySubject = new Subject<void>();
  private challengesNotifySubject = new Subject<void>();
  private champSpecificChallenges: SpecialChallengesDto[] = [];
  private challenges: Challenge[] = [];
  private champions: Champion[] = [];
  private skins: LolChampionsCollectionsChampionSkin[] = [];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  champSpecifivChallengesNotify$ = this.champSpecificChallengesNotifySubject.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  challengesNotify$ = this.challengesNotifySubject.asObservable();

  constructor(private testService: ChallengeControllerService) {
    this.testService.getConnectionStatus().then(resp => {
      if (resp) {
        this.getChallenges();
        this.getChampions();
      }
    });
  }

  getSkins(): Promise<LolChampionsCollectionsChampionSkin[]> {
    if(this.skins.length !== 0){
      return Promise.resolve(this.skins);
    }

    return this.testService.getAllSkins().then(response => {
      this.skins = response;
      return response
    });
  }

 getChampions(): Promise<Champion[]> {
    if(this.champions.length !== 0){
      return Promise.resolve(this.champions);
    }

  return this.testService.getAllChampions().then(response => {
      this.champions = response;
      return response
    });
  }

   getChampSpecificChallenges(): Promise<SpecialChallengesDto[]> {
    if(this.champSpecificChallenges.length !== 0){
      return Promise.resolve( this.champSpecificChallenges);
    }

    return this.testService.getChampSpecificChallenges().then(response => {
      this.champSpecificChallenges = response;
      return response;
    });
  }

  getChallenges(): Promise<Challenge[]> {
    if(this.challenges.length !== 0){
      return Promise.resolve( this.challenges);
    }

    return this.testService.getChallenges().then(response => {
      this.challenges = response;
      this.notifyChampSpecificChallenges();
      return response;
    });
  }

  reloadChallenges(): Promise<SpecialChallengesDto[]> {
    return this.testService.reloadChallenges().then(challenges => {
      this.challenges = challenges;
      this.notifyChallenges();
      this.champSpecificChallenges = [];
      return this.getChampSpecificChallenges()
    })
  }

  notifyChampSpecificChallenges() {
    this.champSpecificChallengesNotifySubject.next();
  }

  notifyChallenges() {
    this.challengesNotifySubject.next();
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
