import {Component} from '@angular/core';
import {TestService} from "./services/test.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular_TestsFuck me';

  constructor(private testService: TestService) {
  }

  text: string = "";
  mes: string | undefined;

  times = 0;

  changeText(): void {
    this.times = this.times + 1;
    this.text = "test clicked: " + this.times + " times.";

    this.testService.getMessage().then(message => {
      this.mes = message
    });
  }

}
