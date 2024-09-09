import {Component, OnInit} from "@angular/core";
import {ChallengeService} from "../services/challenge.service";
import {ChallengeControllerService} from "../services/challenge-controller.service";
import {FormControl} from "@angular/forms";

export enum BackendStatus {
  STARTING= "starting",
  RUNNING = "running",
  ERROR = "error",
  STOPPED = "stopped"
}

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls:['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  backendService: BackendStatus = BackendStatus.STARTING;
  connected = false;
  loading = false;
  hideCompletedControl = new FormControl<boolean>(false);

  constructor(private challengeService: ChallengeService,
              private challengeControllerService: ChallengeControllerService) {
  }

  ngOnInit(): void {
    this.loading = true;

    this.hideCompletedControl.setValue(this.challengeService.getHideCompletedChallenges())

    this.hideCompletedControl.valueChanges.subscribe(value => {
      if(value){
        this.challengeService.setHideCompletedChallenges(true);
      } else {
        this.challengeService.setHideCompletedChallenges(false);
      }
    })

    this.challengeControllerService.waitForBackendStart().subscribe({
      next: res => {
        if(res) {
          this.loading = false;
          this.backendService = BackendStatus.RUNNING
          this.initializeClientConnectionCheck();
          setInterval(() => {
            this.checkBackendStatus()
          }, 15000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.backendService = BackendStatus.ERROR
        console.error('Error while waiting for backend connection:', err);
      }
    });
  }

  reloadChallenges(): void {
    this.loading = true;
    this.challengeService.reloadChallenges().then(()=> this.loading = false);
  }

  reloadEternals(): void {
    this.loading = true;
    this.challengeService.reloadEternals().then(()=> this.loading = false);
  }

  startConnection(): void {
   this.challengeControllerService.startConnection();
  }

  stopConnection(): void {
    this.challengeControllerService.stopConnection();
  }

  checkConnection(): void {
    this.challengeControllerService.getConnectionStatus().then(resp => {
      this.connected = resp;
    }).catch(err => {
      console.log(err)
      this.connected = false;
    });
  }

  checkBackendStatus(): void {
    this.challengeControllerService.checkBackendStatus().then(resp => {
      if(resp){
        this.backendService = BackendStatus.RUNNING
      } else {
        this.backendService = BackendStatus.STOPPED
      }
    }).catch(err => {
      console.log(err)
      this.backendService = BackendStatus.STOPPED
    });
  }

  private initializeClientConnectionCheck(): void {
    this.challengeControllerService.waitForClientConnection().subscribe({
      next: res => {
        if(res) {
          setInterval(() => {
            this.checkConnection()
          }, 500);
        }
      },
      error: (err) => {
        console.error('Error while waiting for backend connection:', err);
      }
    });
  }
}
