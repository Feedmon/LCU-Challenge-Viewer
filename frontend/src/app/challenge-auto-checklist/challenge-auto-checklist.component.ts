import {Component, OnInit} from "@angular/core";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {Challenge} from "../../backend-api/api/models/challenge";
import {ChallengeService, clientChampionSearchBehaviour} from "../services/challenge.service";
import {Champion} from "../../backend-api/api/models/champion";
import {FormControl} from "@angular/forms";
import {Leagues} from "../../backend-api/api/models/leagues";

interface ChampChallengeData extends Champion {
  availableForChallenge: boolean;
  completed: boolean;
  excludedByFilter: boolean;
}

@Component({
  selector: 'app-challenge-view-new',
  templateUrl: 'challenge-auto-checklist.component.html',
  styleUrls: ['./challenge-auto-checklist.component.scss']
})
export class ChallengeAutoChecklistComponent implements OnInit{

  challenges: Challenge[];
  champions: Champion[];

  championsChallengeData: ChampChallengeData[];

  filterForRole: string | undefined;
  championSearch: FormControl<string | null> = new FormControl<string | null>(null);
  hideCompletedChampions = true;

  selectedChallenge: FormControl<Challenge | null> = new FormControl<Challenge | null>(null);

  constructor(private challengeControllerService: ChallengeControllerService,
              private challengeService: ChallengeService) {
  }

  ngOnInit() :void{
    this.challengeService.getChampions().then(champions => {
      this.champions = champions;
      this.initializeChallengeData();
    });

    this.championSearch.valueChanges.subscribe(() => {
      this.filterChamps()
    })

    this.challengeService.challengesNotify$.subscribe(()=> this.loadChallengeData())
  }

  visibilityChanged():void {
    this.hideCompletedChampions = !this.hideCompletedChampions;
  }

  roleSelect(role: string) {
    if(this.filterForRole && this.filterForRole === role){
      this.filterForRole = undefined;
    }else {
      this.filterForRole = role;
    }

    this.filterChamps();
  }

  private subscribeToChallengeChange(): void {
    this.selectedChallenge.valueChanges.subscribe(challenge => {
      if(challenge && this.champions){
        this.setupChampionChallengeData(this.champions);

        this.championsChallengeData.forEach(champ => {
          champ.availableForChallenge = this.champAvailableForChallenge(champ, challenge);
          champ.completed = challenge.completedIds.includes(champ.id);
          champ.excludedByFilter = this.champShouldBeExcludedByFilter(champ);
        })
        this.filterChamps();
      }
    })
  }

  private champAvailableForChallenge(champ: ChampChallengeData, challenge: Challenge): boolean {
    if(challenge.availableIds.length === 0 && !this.isChallengeCompleted(challenge)){
      return true;
    }
    return challenge.availableIds.includes(champ.id) || challenge.completedIds.includes(champ.id);
  }

  private isChallengeCompleted(challenge: Challenge): boolean {
    return challenge.currentLevel === Leagues.Master || challenge.currentLevel === Leagues.Grandmaster || challenge.currentLevel === Leagues.Challenger;
  }

  private initializeChallengeData(): void {
    this.challengeControllerService.getProgressableChampionChallenges()
      .then(response=> {
        this.challenges = response;
        this.subscribeToChallengeChange();
        this.selectedChallenge.patchValue(this.challenges[38]);
      });
  }

  private setupChampionChallengeData(champion: Champion[]): void {
    this.championsChallengeData = champion.map(champ => {
      return {...champ, availableForChallenge: false, completed: false, excludedByFilter: false};
    });
  }

  private loadChallengeData(): void {
    this.challengeControllerService.getProgressableChampionChallenges()
      .then(response=> {
        this.challenges = response;
        const selectedChallenge = this.challenges.find(chall => chall.id === this.selectedChallenge.value?.id) ?? null;
        this.selectedChallenge.patchValue(selectedChallenge);
        this.filterChamps();
      });
  }

  private filterChamps(): void {
    this.championsChallengeData.forEach(champ => champ.excludedByFilter = this.champShouldBeExcludedByFilter(champ));
  }

  private champShouldBeExcludedByFilter(champ: ChampChallengeData): boolean {
    return this.champShouldBeExcludedBySearch(champ) || this.champShouldBeExcludedByRole(champ);
  }

  private champShouldBeExcludedByRole(champ: ChampChallengeData): boolean {
    return this.filterForRole ? !champ.laneAssignments.includes(this.filterForRole.toUpperCase()) : false;
  }

  private champShouldBeExcludedBySearch(champ: ChampChallengeData): boolean {
    return this.championSearch.value ? !clientChampionSearchBehaviour(champ.name, this.championSearch.value) : false
  }
}
