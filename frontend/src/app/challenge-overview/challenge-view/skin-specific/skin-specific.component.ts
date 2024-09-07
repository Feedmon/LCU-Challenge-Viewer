import {Component, OnInit} from "@angular/core";
import {Challenge} from "../../../../backend-api/api/models/challenge";
import {CompletionViewItem} from "../completion-view/completion-view.component";
import {ActivatedRoute} from "@angular/router";
import {ChallengeControllerService} from "../../../services/challenge-controller.service";
import {ChallengeService} from "../../../services/challenge.service";
import {RouteParameters} from "../../../route-parameters";
import { ChampionSkin } from "src/backend-api/api/models/champion-skin";

@Component({
  selector: 'app-skin-specific-challenge',
  templateUrl: 'skin-specific.component.html'
})
export class SkinSpecificComponent implements OnInit {
  loading = true;
  challenge: Challenge;
  skins: ChampionSkin[]
  itemsChallengeData: CompletionViewItem[];

  constructor(private activatedRoute: ActivatedRoute,
              private challengeControllerService: ChallengeControllerService,
              private challengeService: ChallengeService) {
  }

  ngOnInit() :void{
    Promise.all([
      this.challengeControllerService.getChallengeInfo(this.activatedRoute.snapshot.params[RouteParameters.challengeName]),
      this.challengeService.getSkins()
    ]).then(([challengeResp, skinsResp]) => {
      this.loading = false;
      this.challenge = challengeResp
      this.skins = skinsResp;
      this.itemsChallengeData = this.setupItemChallengeData(this.skins);
    }).catch(error => {
      this.loading = false;
      console.error("Error while loading data:", error);
    });
  }

  private setupItemChallengeData(skins: ChampionSkin[]): CompletionViewItem[] {
    return skins.map(skin => {
      return {
        name: skin.name ?? "name not found",
        squarePortraitJpg: skin.squarePortraitJpg,
        availableForChallenge: this.challengeService.idAvailableForChallenge(skin.id!, this.challenge),
        completed: this.challenge.completedIds.includes(skin.id!),
        excludedBySearch: false
      };
    });
  }

}
