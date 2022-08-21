import {Injectable} from '@angular/core';
import {TestControllerService} from "../../backend-api/api/services/test-controller.service";

@Injectable()
export class TestService {

  constructor(private testControllerService: TestControllerService) {
  }

  getMessage(): Promise<string> {
    return this.testControllerService.test().toPromise();
  }
}
