import {Component} from '@angular/core';
import {ChallengeControllerService} from "./services/challenge-controller-service-wrapper.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'oof';
  text = "";
  mes: string | undefined;
  times = 0;

  constructor(private testService: ChallengeControllerService) {
  }

  changeText(): void {
    this.times = this.times + 1;
    this.text = "test clicked: " + this.times + " times.";

  }

}
