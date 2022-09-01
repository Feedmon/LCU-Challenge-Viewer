import {Component, OnInit} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {TestService} from "../services/test.service";
import {SubjectDto} from "../../backend-api/api/models/subject-dto";

@Component({
  selector: 'app-baumig',
  templateUrl: 'baumig.component.html'
})
export class BaumigComponent implements OnInit {
  tableData: SubjectDto[] = [];

  dataSource = new MatTableDataSource<SubjectDto>();
  displayedColumns = ["name", "teacher", "id"];

  constructor(private testService: TestService) {
  }

  ngOnInit(): void {
    this.testService.getAllSubjects().then(response => {
      this.tableData = response;
      this.dataSource.data = this.tableData;
    })
  }


  typedSubject(untypedSubject: SubjectDto): SubjectDto {
    return untypedSubject;
  }

  getValue(Subject: SubjectDto, columnName: string) {
    // @ts-ignore
    return Subject[columnName];
  }
}
