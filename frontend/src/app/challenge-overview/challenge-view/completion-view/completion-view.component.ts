import {Component, Input, OnInit} from "@angular/core";
import {Challenge} from "../../../../backend-api/api/models/challenge";
import {FormControl} from "@angular/forms";
import {clientChampionSearchBehaviour} from "../../../services/challenge.service";

export interface CompletionViewItem  {
  name: string;
  squarePortraitJpg: string[];
  availableForChallenge: boolean;
  completed: boolean;
  excludedBySearch: boolean;
}

@Component({
  selector: 'app-challenge-completion-view',
  templateUrl: 'completion-view.component.html',
  styleUrls: ['./completion-view.component.scss']
})
export class CompletionViewComponent implements OnInit {
  @Input() challenge: Challenge;
  @Input() itemsChallengeData: CompletionViewItem[];

  itemSearch: FormControl<string | null> = new FormControl<string | null>(null);
  hideCompletedItems = true;

  ngOnInit(): void {
    this.itemSearch.valueChanges.subscribe(() => {
      this.filterChamps()
    })
  }

  visibilityChanged():void {
    this.hideCompletedItems = !this.hideCompletedItems;
  }

  private filterChamps(): void {
    this.itemsChallengeData.forEach(champ => champ.excludedBySearch = this.champShouldBeExcludedBySearch(champ));
  }

  private champShouldBeExcludedBySearch(item: CompletionViewItem): boolean {
    return this.itemSearch.value ? !clientChampionSearchBehaviour(item.name, this.itemSearch.value) : false
  }

}
