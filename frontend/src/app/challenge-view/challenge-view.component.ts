import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RouteParameters} from "../route-parameters";
import {ChallengeControllerService} from "../services/challenge-controller-service-wrapper.service";
import {Challenge} from "../../backend-api/api/models/challenge";
import {ChallengeService} from "../services/challenge.service";
import {Champion} from "../../backend-api/api/models/champion";
import {
  LolChampionsCollectionsChampionSkin
} from "../../backend-api/api/models/lol-champions-collections-champion-skin";

@Component({
  selector: 'app-challenge-view',
  templateUrl: 'challenge-view.component.html'
})
export class ChallengeViewComponent implements OnInit{

  challenge: Challenge;
  skins: LolChampionsCollectionsChampionSkin[];
  champions: Champion[]

  constructor(private activatedRoute: ActivatedRoute,
              private testService: ChallengeControllerService,
              private challengeService: ChallengeService) {
  }

  ngOnInit() :void{
    this.testService.getChallengeInfo(this.activatedRoute.snapshot.params[RouteParameters.challengeName])
      .then(response=> this.challenge = response);
    this.challengeService.getChampions().then(resp => this.champions = resp);
    this.challengeService.getSkins().then(resp => this.skins = resp);
  }

  getNameOrId(id: number): string {
    if(this.challenge.idListType === "CHAMPION"){
      return this.champions.find(champ => champ.id === id)!.name;
    } else if(this.challenge.idListType === "CHAMPION_SKIN"){
      return this.skins.find(skin => skin.id === id)!.name!;
    } else {
      return id.toString();
    }
  }
}
