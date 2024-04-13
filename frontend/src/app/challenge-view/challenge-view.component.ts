import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RouteParameters} from "../route-parameters";
import {TestService} from "../services/test.service";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";

@Component({
  selector: 'app-challenge-view',
  templateUrl: 'challenge-view.component.html'
})
export class ChallengeViewComponent implements OnInit{

  challenge: SpecialChallengesDto;
  constructor(private activatedRoute: ActivatedRoute,
              private testService: TestService) {
  }

  ngOnInit() :void{
    this.testService.getChallengeInfo(this.activatedRoute.snapshot.params[RouteParameters.challengeName])
      .then(response=> this.challenge = response);
  }

  getName():string {
    return JSON.stringify(this.challenge);
  }
}
