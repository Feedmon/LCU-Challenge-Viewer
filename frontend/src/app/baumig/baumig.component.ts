import {Component, OnInit} from "@angular/core";
import {TestControllerService} from "../../backend-api/api/services/test-controller.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-baumig',
  templateUrl: 'baumig.component.html'
})
export class BaumigComponent implements OnInit {
  tableData: string[] = ["test"];

  dataSource = new MatTableDataSource<string>();
  displayedColumns = ["test1", "test2", "test3"];

  constructor(private testControllerService: TestControllerService) {
  }

  ngOnInit(): void {
    this.testControllerService.test().toPromise().then(response => {
      this.tableData[1] = response;
      this.dataSource.data = this.tableData;
    })
  }


  typedString(untypedString: string): string {
    return untypedString;
  }
}
