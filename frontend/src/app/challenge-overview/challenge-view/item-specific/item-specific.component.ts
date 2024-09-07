import {Component, OnInit} from "@angular/core";
import {Challenge} from "../../../../backend-api/api/models/challenge";
import {CompletionViewItem} from "../completion-view/completion-view.component";
import {ActivatedRoute} from "@angular/router";
import {ChallengeControllerService} from "../../../services/challenge-controller.service";
import {ChallengeService} from "../../../services/challenge.service";
import {RouteParameters} from "../../../route-parameters";
import {IngameItem} from "../../../../backend-api/api/models/ingame-item";

@Component({
  selector: 'app-item-specific-challenge',
  templateUrl: 'item-specific.component.html'
})
export class ItemSpecificComponent implements OnInit {
  loading = true;
  challenge: Challenge;
  items: IngameItem[];
  itemsChallengeData: CompletionViewItem[];

  constructor(private activatedRoute: ActivatedRoute,
              private challengeControllerService: ChallengeControllerService,
              private challengeService: ChallengeService) {
  }

  ngOnInit() :void{
    Promise.all([
      this.challengeControllerService.getChallengeInfo(this.activatedRoute.snapshot.params[RouteParameters.challengeName]),
      this.challengeControllerService.getAllItems()
    ]).then(([challengeResp, itemsResp]) => {
      this.loading = false;
      this.challenge = challengeResp
      this.items = itemsResp;
      this.itemsChallengeData = this.setupItemChallengeData(this.items);
    }).catch(error => {
      this.loading = false;
      console.error("Error while loading data:", error);
    });
  }


  private setupItemChallengeData(items: IngameItem[]): CompletionViewItem[] {
    return items.map(item => {
      return {
        name: item.name,
        squarePortraitJpg: item.iconSquarePortrait,
        availableForChallenge: this.challengeService.idAvailableForChallenge(item.id, this.challenge),
        completed: this.challenge.completedIds.includes(item.id),
        excludedBySearch: false
      };
    });
  }
}
