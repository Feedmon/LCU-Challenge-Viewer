import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {TestService} from "../../services/test.service";

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent {
  subject = "";
  teacher = "";

  constructor(private matDialogRef: MatDialogRef<CreateClassComponent>,
              private testService: TestService) {
  }

  save(): void {
    this.testService.createSubject({teacher: this.teacher, className: this.subject}).then(() => this.close());

  }

  private close(): void {
    this.matDialogRef.close(true);
  }
}
