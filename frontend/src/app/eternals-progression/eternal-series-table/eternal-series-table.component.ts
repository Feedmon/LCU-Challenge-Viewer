import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, ViewChild} from "@angular/core";
import {ChampionWithEternalSeries} from "../eternals-progression.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {SeriesStatstone} from "../../../backend-api/api/models/series-statstone";
import {clientChampionSearchBehaviour} from "../../services/challenge.service";
import {Challenge} from "../../../backend-api/api/models/challenge";

interface TableFilterChanges {
  tableFilter?: SimpleChange;
  challengeFilter?: SimpleChange;
}

@Component({
  selector: 'app-eternal-series',
  templateUrl: 'eternal-series-table.component.html',
  styleUrls: ['./eternal-series-table.component.scss']
})
export class EternalSeriesTableComponent implements OnInit, OnChanges, AfterViewInit{
  @Input() championWithEternalSeries: ChampionWithEternalSeries[];
  @Input() tableFilter: string | null ;
  @Input() challengeFilter: Challenge[] | null ;

  @ViewChild(MatSort) sort: MatSort ;

  displayedColumns = ["champion", "seriesName", "milestone5", "milestone15", "currentMilestone", "championRoles"];
  dataSource = new MatTableDataSource<ChampionWithEternalSeries>();

  ngOnInit(): void {
    this.dataSource.data = this.championWithEternalSeries;
    this.dataSource.filterPredicate = filterOverride
  }

  ngOnChanges(changes: TableFilterChanges): void {
    if(changes.tableFilter){
      this.dataSource.filter = changes.tableFilter.currentValue
    }
    if(changes.challengeFilter){
      if(this.challengeFilter && this.challengeFilter.length > 0){
        let availableChampIds: number[] = this.championWithEternalSeries.map(champ=> champ.id);
        for (let challenge of this.challengeFilter) {
          if( challenge.name.includes( "Rekindle the Old Furnace") || challenge.name.includes("Well-Rounded Traveller")){
            availableChampIds =  availableChampIds.filter(id => !challenge.completedIds.includes(id));
          } else {
            availableChampIds = availableChampIds.filter(id => challenge.availableIds.includes(id) && !challenge.completedIds.includes(id))
          }
        }
        this.dataSource.data = this.championWithEternalSeries.filter(champ => availableChampIds.includes(champ.id));
      }else {
        this.dataSource.data = this.championWithEternalSeries;
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  typedChampionWithEternals(untypedSubject: ChampionWithEternalSeries): ChampionWithEternalSeries {
    return untypedSubject;
  }

  getToolTipForMileStoneProgress(statstone: SeriesStatstone): string {
    return "Milestone " + statstone.currentMilestone + " | " + statstone.currentMilestoneCompletionPercentage + "% towards  Milestone " + (statstone.currentMilestone + 1);
  }
}

function filterOverride(champ: ChampionWithEternalSeries, filter: string): boolean {
  return clientChampionSearchBehaviour(champ.name, filter);
}
