import {Injectable} from '@angular/core';
import {TestControllerService} from "../../backend-api/api/services/test-controller.service";
import {CreateClassRequestDto} from "../../backend-api/api/models/create-class-request-dto";
import {SubjectDto} from "../../backend-api/api/models/subject-dto";

@Injectable()
export class TestService {

  constructor(private testControllerService: TestControllerService) {
  }

  getAllSubjects(): Promise<SubjectDto[]> {
    return this.testControllerService.getAllSubjects().toPromise();
  }

  createSubject(createClassRequest: CreateClassRequestDto): Promise<void> {
    return this.testControllerService.create({body: createClassRequest}).toPromise()
  }
}
