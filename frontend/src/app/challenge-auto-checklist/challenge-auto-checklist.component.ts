import {Component, OnInit} from "@angular/core";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {Challenge} from "../../backend-api/api/models/challenge";
import {ChallengeService, clientChampionSearchBehaviour} from "../services/challenge.service";
import {Champion} from "../../backend-api/api/models/champion";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "../services/local-storage.service";

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

  private autoChecklistSavedChallengeIdKey = "autoCheckListChallengeId";

  constructor(private challengeControllerService: ChallengeControllerService,
              private challengeService: ChallengeService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() :void {
    this.challengeControllerService.waitForClientConnection().subscribe({
      next: res => {
        if(res) {
          this.initializeComponent();
        }
      },
      error: (err) => {
        console.error('Error while waiting for backend connection:', err);
      }
    });
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

  private initializeComponent(): void {
    this.challengeService.getChampions().then(champions => {
      this.champions = champions;
      this.initializeChallengeData();
    });

    this.championSearch.valueChanges.subscribe(() => {
      this.filterChamps()
    })

    this.challengeService.challengesNotify$.subscribe(()=> this.loadChallengeData());
  }

  private subscribeToChallengeChange(): void {
    this.selectedChallenge.valueChanges.subscribe(challenge => {
      if(challenge && this.champions){
        this.localStorageService.setNumber(this.autoChecklistSavedChallengeIdKey, challenge.id);
        this.setupChampionChallengeData(this.champions);

        this.championsChallengeData.forEach(champ => {
          champ.availableForChallenge = this.challengeService.idAvailableForChallenge(champ.id, challenge);
          champ.completed = challenge.completedIds.includes(champ.id);
          champ.excludedByFilter = this.champShouldBeExcludedByFilter(champ);
        })
        this.filterChamps();
      }
    })
  }

  private initializeChallengeData(): void {
    this.challengeService.getProgressableChampionChallenges()
      .then(response=> {
        this.challenges = response;
        this.subscribeToChallengeChange();
        this.selectedChallenge.patchValue(this.getChallengeToInitialize());
      });
  }

  private getChallengeToInitialize(): Challenge {
    const challengeId = this.localStorageService.getNumber(this.autoChecklistSavedChallengeIdKey);
    if(challengeId) {
      return this.challenges.find(chall => chall.id === challengeId) ?? this.challenges[2];
    }
    return this.challenges[2];
  }

  private setupChampionChallengeData(champion: Champion[]): void {
    this.championsChallengeData = champion.map(champ => {
      return {...champ, availableForChallenge: false, completed: false, excludedByFilter: false};
    });
  }

  private loadChallengeData(): void {
    this.challengeService.getProgressableChampionChallenges()
      .then(response=> {
        this.challenges = response;
        const selectedChallenge = this.challenges.find(chall => chall.id === this.selectedChallenge.value?.id) ?? this.challenges[0];
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
