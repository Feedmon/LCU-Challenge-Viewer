import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {SpecialChallengesDto} from "../../backend-api/api/models/special-challenges-dto";
import {Champion} from "../../backend-api/api/models/champion";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {ChallengeService, clientChampionSearchBehaviour} from "../services/challenge.service";
import {LocalStorageService} from "../services/local-storage.service";
import {Subscription} from "rxjs";

interface ChampData {
    imageUrl: string;
    image?: string[];
    name: string;
    id: number;
  }

@Component({
  selector: 'app-champions-view',
  templateUrl: 'champions-challenge-completion.component.html',
  styleUrls: ['./champions-challenge-completion.component.scss']
})
export class ChampionsChallengeCompletionComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  challenges: SpecialChallengesDto[];
  champions: Champion[];
  displayedColumns = ['champion'];
  dataSource = new MatTableDataSource<ChampData>();

  options: string[];
  selectedOptions= new FormControl<string[]>([]);
  tableFilter = new FormControl<string>("");

  private selectedColumnsStorageKey = "challengeCompletionChallengesKey";
  private standardSelection = ['Perfectionist', 'Jack of All Champs', 'Champion Ocean', 'Adapt to All Situations'];

  private subscription: Subscription = new Subscription();

  constructor(private challengeService: ChallengeService,
              private localStorageService: LocalStorageService) {
  }

  updateColumns(selectedColumns: string[]) {
    this.displayedColumns = ['champion', ...selectedColumns.filter(col => this.options.includes(col))];

    this.dataSource.data = this.champions.map(champ => {
            return {
              imageUrl: champ.squarePortraitPath,
              image: champ.squarePortraitJpg,
              name: champ.name,
              id: champ.id ?? -1
            }
    });
    this.dataSource.paginator = this.paginator;
  }

   ngOnInit(): void {
     this.dataSource.filterPredicate = filterOverride

     this.subscription.add(this.tableFilter.valueChanges.subscribe(value =>{
       if(value) {
         this.dataSource.filter = value;
       }else {
         this.dataSource.filter = "";
       }
     }));

     this.challengeService.getChampions().then(res => this.champions = res);

     const selectedColumns: string[] = this.localStorageService.getList(this.selectedColumnsStorageKey) ?? this.standardSelection;
     this.selectedOptions.patchValue(selectedColumns)
     this.updateTable();
     this.subscription.add(this.challengeService.champSpecificChallengesNotify$.subscribe(() => {
        this.updateTable();
     }));
    }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCellColorClass(champId: number, challengeName: string):string {
    if(this.challenges.find(s=> s.challengeName === challengeName)!.completedIds.includes(champId)){
      return 'green-cell';
    }else if(this.challenges.find(s=> s.challengeName === challengeName)!.availableIds.includes(champId)) {
      return 'red-cell';
    }else {
      return 'grey-cell';
    }
  }

  selectOpenedOrClosed(isOpened: boolean): void {
     if(!isOpened){
       this.updateColumns(this.selectedOptions.value ?? []);
       this.updateLocalStorageSelectedColumns();
     }
  }

  getDescriptionForChallengeName(challengeName: string): string{
   return this.challenges!.find(chall => chall.challengeName === challengeName)!.challengeDescription;
  }

  private updateLocalStorageSelectedColumns(): void {
    if(this.selectedOptions.value){
      this.localStorageService.setList(this.selectedColumnsStorageKey, this.selectedOptions.value);
    } else {
      this.localStorageService.removeItem(this.selectedColumnsStorageKey);
    }
  }

  private updateTable(): void{
    this.challengeService.getChampSpecificChallenges().then(res => {
      this.challenges = res.filter(chal => chal.challengeType ==="Champion")
      this.options = [];
      this.challenges.forEach(chal => this.options.push(chal.challengeName));
      this.updateColumns(this.selectedOptions.value ?? []);
    })
  }
}

function filterOverride(champ: ChampData, filter: string): boolean {
  return clientChampionSearchBehaviour(champ.name, filter);
}
