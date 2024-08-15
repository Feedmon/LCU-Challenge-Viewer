import {Component, OnInit} from "@angular/core";
import { Router } from '@angular/router';
import {ChallengeService} from "../services/challenge.service";
import {TestService} from "../services/test.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls:['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  connected = false;

  constructor(private challengeService: ChallengeService,
              private testService: TestService) {
  }

  ngOnInit(): void {
    setInterval(() => {
       this.testConnection()
    }, 100);
  }

  reloadChallenges(): void {
    this.challengeService.reloadChallenges();

    //window.location.reload()
  }

  startConnection(): void {
   this.testService.startConnection();
  }

  stopConnection(): void {
    this.testService.stopConnection();
  }

  testConnection(): void {
    this.testService.getConnectionStatus().then(resp => {
      this.connected = resp;
    });
  }

}
