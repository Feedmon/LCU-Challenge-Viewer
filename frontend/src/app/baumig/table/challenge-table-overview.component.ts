import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {SpecialChallengesDto} from "../../../backend-api/api/models/special-challenges-dto";

@Component({
  selector: 'app-challenge-overview-table',
  templateUrl: 'challenge-table-overview.component.html',
  styleUrls: ['./challenge-table-overview.component.scss']
})
export class ChallengeTableOverviewComponent implements OnInit, AfterViewInit {
  @Input() challenges: SpecialChallengesDto[]

  // if wanted to  be case-insensitive use sortingDataAccessor https://github.com/angular/components/issues/9205
  // if wanted to  be case-insensitive use sortingDataAccessor https://github.com/angular/components/issues/9205
  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

// todo should only be accessed by champ challenges actually use for all challenges maybe do site with ngif for champ skin etc
  // todo do site like mmr
  // todo maybe also column for highest non leaderboard level / if highest level already achieved

  dataSource = new MatTableDataSource<SpecialChallengesDto>();
  displayedColumns = ["name","description", "retired", "type", "level"];

  ngOnInit(): void {
    this.dataSource.data = this.challenges;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  typedSpecialChallenge(untypedSubject: SpecialChallengesDto): SpecialChallengesDto {
    return untypedSubject;
  }

  getChallengeLink(challengeType: string) {
    if(challengeType === "CHAMPION"){
      return "/champ-challenge-details"
    }else if(challengeType ==="CHAMPION_SKIN"){
      return "skin-challenge-details";
    }else {
      return "/challenge-details";
    }
  }
}
