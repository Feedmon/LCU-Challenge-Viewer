import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RouteParameters} from "../../route-parameters";
import {ChallengeControllerService} from "../../services/challenge-controller.service";
import {Challenge} from "../../../backend-api/api/models/challenge";

@Component({
  selector: 'app-challenge-view',
  templateUrl: 'challenge-view.component.html'
})
export class ChallengeViewComponent implements OnInit, OnDestroy{

  challenge: Challenge;

   private subscription: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
              private challengeControllerService: ChallengeControllerService) {
  }

  ngOnInit() :void{
    this.loadChallengeData();

      this.subscription.add(this.challengeService.challengesNotify$.subscribe(()=> this.loadChallengeData()));
  }

 ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadChallengeData(): void {
        this.challengeControllerService.getChallengeInfo(this.activatedRoute.snapshot.params[RouteParameters.challengeName])
          .then(response=> this.challenge = response);
    }

}
