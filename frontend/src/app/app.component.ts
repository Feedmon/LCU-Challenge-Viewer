import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular_TestsFuck me';

  text: string ="";

  times = 0;

  changeText(): void {
    this.times = this.times + 1;
    this.text = "test clicked: " + this.times + " times.";
    
  }
}
