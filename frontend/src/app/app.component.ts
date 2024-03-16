import {Component} from '@angular/core';
import {TestService} from "./services/test.service";

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

  constructor(private testService: TestService) {
  }

  changeText(): void {
    this.times = this.times + 1;
    this.text = "test clicked: " + this.times + " times.";

  }

}
