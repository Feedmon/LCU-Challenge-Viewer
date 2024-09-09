import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Challenge} from "../../../backend-api/api/models/challenge";
import {FormControl} from "@angular/forms";

interface ChallengeTableChanges {
  challenges?: SimpleChange;
}

@Component({
  selector: 'app-challenge-overview-table',
  templateUrl: 'challenge-table-overview.component.html'
})
export class ChallengeTableOverviewComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() challenges: Challenge[]

  // if wanted to  be case-insensitive use sortingDataAccessor https://github.com/angular/components/issues/9205
  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // todo maybe also column for highest non leaderboard level / if highest level already achieved

  dataSource = new MatTableDataSource<Challenge>();
  displayedColumns = ["name","description", "retired","leaderboard", "type", "level"];
  tableFilter = new FormControl<string>("");

  ngOnInit(): void {
    this.dataSource.data = this.challenges;
    this.dataSource.filterPredicate = filterOverride

    this.tableFilter.valueChanges.subscribe(value =>{
      if(value) {
        this.dataSource.filter = value;
      }else {
        this.dataSource.filter = "";
      }
    })
  }

  ngOnChanges(changes: ChallengeTableChanges): void {
    if(changes.challenges){
      this.dataSource.data = changes.challenges.currentValue
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  typedSpecialChallenge(untypedSubject: Challenge): Challenge {
    return untypedSubject;
  }

  getChallengeLink(challengeType: string) {
    if(challengeType === "CHAMPION"){
      return "/champ-challenge-details"
    }else if(challengeType ==="CHAMPION_SKIN"){
      return "/skin-challenge-details";
    }else if(challengeType === "ITEM") {
      return "/item-challenge-details";
    } else {
      return "/challenge-details";
    }
  }
}

function filterOverride(challenge: Challenge, filter: string): boolean {
  return challenge.name.toLowerCase().includes(filter.toLowerCase());
}
