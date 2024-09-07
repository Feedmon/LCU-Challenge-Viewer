import {Component, OnInit} from "@angular/core";
import {RouteParameters} from "../../../route-parameters";
import {ActivatedRoute} from "@angular/router";
import {ChallengeControllerService} from "../../../services/challenge-controller.service";
import {ChallengeService} from "../../../services/challenge.service";
import {Challenge} from "../../../../backend-api/api/models/challenge";
import {Champion} from "../../../../backend-api/api/models/champion";
import {CompletionViewItem} from "../completion-view/completion-view.component";

@Component({
  selector: 'app-champion-specific-challenge',
  templateUrl: 'champion-specific.component.html'
})
export class ChampionSpecificComponent implements OnInit {
  loading = true;
  challenge: Challenge;
  champions: Champion[]
  itemsChallengeData: CompletionViewItem[];

  constructor(private activatedRoute: ActivatedRoute,
              private challengeControllerService: ChallengeControllerService,
              private challengeService: ChallengeService) {
  }

  ngOnInit() :void{
    Promise.all([
      this.challengeControllerService.getChallengeInfo(this.activatedRoute.snapshot.params[RouteParameters.challengeName]),
      this.challengeService.getChampions()
    ]).then(([challengeResp, championsResp]) => {
      this.loading = false;
      this.challenge = challengeResp
      this.champions = championsResp;
      this.itemsChallengeData = this.setupChampionChallengeData(this.champions);
    }).catch(error => {
      this.loading = false;
      console.error("Error while loading data:", error);
    });
  }

  private setupChampionChallengeData(champion: Champion[]): CompletionViewItem[] {
    return champion.map(champ => {
      return {
        name: champ.name,
        squarePortraitJpg: champ.squarePortraitJpg,
        availableForChallenge: this.challengeService.idAvailableForChallenge(champ.id, this.challenge),
        completed: this.challenge.completedIds.includes(champ.id),
        excludedBySearch: false
      };
    });
  }

}
