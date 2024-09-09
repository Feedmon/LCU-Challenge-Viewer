import {Component, OnInit} from "@angular/core";
import {ChallengeService} from "../services/challenge.service";
import {ChampionIdWithStatstones} from "../../backend-api/api/models/champion-id-with-statstones";
import {Champion} from "../../backend-api/api/models/champion";
import {FormControl} from "@angular/forms";
import {
  SeriesStatstonesWithCompletionValues
} from "../../backend-api/api/models/series-statstones-with-completion-values";
import {Challenge} from "../../backend-api/api/models/challenge";
import {Router} from "@angular/router";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {LocalStorageService} from "../services/local-storage.service";

export interface ChampionWithEternalSeries extends Champion, SeriesStatstonesWithCompletionValues {}

@Component({
  selector: 'app-eternals-view',
  templateUrl: 'eternals-progression.component.html',
  styleUrls: ['./eternals-progression.component.scss']
})
export class EternalsProgressionComponent implements OnInit {
  eternals: ChampionIdWithStatstones[];
  challenges: Challenge[];
  tableFilter = new FormControl<string>("");
  selectedOptions= new FormControl<Challenge[]>([]);
  options: Challenge[];

  private champions: Champion[];
  private selectedEternalChallengesStorageKey = "eternalChallengesStorageKey";

  constructor(private challengeService: ChallengeService,
              private challengeControllerService: ChallengeControllerService,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.challengeControllerService.waitForClientConnection().subscribe({
      next: res => {
        if(res) {
          this.initializeData();
        }
      },
      error: (err) => {
        console.error('Error while waiting for backend connection:', err);
      }
    });


    this.challengeService.eternalsNotify$.subscribe(()=> this.reloadEternals())
  }

  combineChampionsWithStarterSeries(): ChampionWithEternalSeries[] {
    return this.champions.map(champion => {
      const matchingEternal = this.eternals.find(eternal => champion.id === eternal.championId);

      if (matchingEternal) {
        return {
          ...champion,
          ...matchingEternal.starterSeriesStatstones
        };
      }

      return null;
    }).filter(item => item !== null) as ChampionWithEternalSeries[]
  }

  combineChampionsWithSeries1(): ChampionWithEternalSeries[] {
    return this.champions.map(champion => {
      const matchingEternal = this.eternals.find(eternal => champion.id === eternal.championId);

      if (matchingEternal) {
        return {
          ...champion,
          ...matchingEternal.series1Statstones
        };
      }

      return null;
    }).filter(item => item !== null) as ChampionWithEternalSeries[]
  }

  combineChampionsWithSeries2(): ChampionWithEternalSeries[] {
    return this.champions.map(champion => {
      const matchingEternal = this.eternals.find(eternal => champion.id === eternal.championId);

      if (matchingEternal) {
        return {
          ...champion,
          ...matchingEternal.series2Statstones
        };
      }

      return null;
    }).filter(item => item !== null) as ChampionWithEternalSeries[]
  }

  private initializeData(): void {
    Promise.all([
      this.challengeService.getEternals(),
      this.challengeService.getChampions(),
      this.challengeService.getChallenges()
    ]).then(([eternalsResp, championsResp, challengesResp]) => {
      this.eternals = eternalsResp;
      this.champions = championsResp;
      this.challenges = challengesResp.filter(chall => chall.description.includes("Eternal") && !chall.name.includes("Mile") && !chall.name.includes("Old Friends"));
      this.options = this.challenges;
      this.loadSelectedChallenges(this.challenges);

      this.selectedOptions.valueChanges.subscribe(value => {
        if(value){
          this.localStorageService.setList(this.selectedEternalChallengesStorageKey, value.map(chall => chall.id))
        }
      })
    }).catch(error => {
      console.error("Error while loading data:", error);
    });
  }

  private loadSelectedChallenges(challenges: Challenge[]): void {
    const selectedChallengeIds: number[] | null = this.localStorageService.getList(this.selectedEternalChallengesStorageKey);
    if(selectedChallengeIds){
      this.selectedOptions.setValue(challenges.filter(chall => selectedChallengeIds.includes(chall.id)))
    }
  }

  private reloadEternals(): void {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['eternals']);
    });
  }
}
