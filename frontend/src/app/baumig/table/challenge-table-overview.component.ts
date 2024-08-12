import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {SpecialChallengesDto} from "../../../backend-api/api/models/special-challenges-dto";

@Component({
  selector: 'app-challenge-overview-table',
  templateUrl: 'challenge-table-overview.component.html'
})
export class ChallengeTableOverviewComponent implements OnInit, AfterViewInit {
  @Input() challenges: SpecialChallengesDto[]

  hideLevelMasterPlus = true;

  // if wanted to  be case-insensitive use sortingDataAccessor https://github.com/angular/components/issues/9205
  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  dataSource = new MatTableDataSource<SpecialChallengesDto>();
  displayedColumns = ["name", "type", "level"];

  ngOnInit(): void {
  if(this.hideLevelMasterPlus){
    this.dataSource.data = this.challenges.filter(challenge => challenge.challengeLeague !== 'H Master');
    } else {
    this.dataSource.data = this.challenges;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.translateMatPaginator(this.paginator);
    this.dataSource.paginator = this.paginator;
  }

  typedSpecialChallenge(untypedSubject: SpecialChallengesDto): SpecialChallengesDto {
    return untypedSubject;
  }

  private translateMatPaginator(paginator: MatPaginator): void {
    paginator._intl.itemsPerPageLabel = "Einträge pro Seite";
    paginator._intl.nextPageLabel= "Nächste Seite";
    paginator._intl.previousPageLabel = "Vorherige Seite";
    paginator._intl.firstPageLabel = "Erste Seite";
    paginator._intl.lastPageLabel = "Letzte Seite";
  }
}
