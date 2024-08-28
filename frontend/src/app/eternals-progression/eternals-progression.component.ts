import {Component, OnInit} from "@angular/core";
import {ChallengeService} from "../services/challenge.service";
import {ChampionIdWithStatstones} from "../../backend-api/api/models/champion-id-with-statstones";
import {Champion} from "../../backend-api/api/models/champion";
import {FormControl} from "@angular/forms";
import {
  SeriesStatstonesWithCompletionValues
} from "../../backend-api/api/models/series-statstones-with-completion-values";
import {Challenge} from "../../backend-api/api/models/challenge";

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

  constructor(private challengeService: ChallengeService) {
  }

  ngOnInit(): void {
    Promise.all([
      this.challengeService.getEternals(),
      this.challengeService.getChampions(),
      this.challengeService.getChallenges()
    ]).then(([eternalsResp, championsResp, challengesResp]) => {
      this.eternals = eternalsResp;
      this.champions = championsResp;
      this.challenges = challengesResp.filter(chall => chall.description.includes("Eternal") && !chall.name.includes("Mile") && !chall.name.includes("Old Friends"));
      this.options = this.challenges;
    }).catch(error => {
      console.error("Fehler beim Laden der Daten:", error);
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

  private reloadEternals(): void {
    this.eternals = [];
    this.challengeService.getEternals().then(eternals => this.eternals = eternals);
  }
}
