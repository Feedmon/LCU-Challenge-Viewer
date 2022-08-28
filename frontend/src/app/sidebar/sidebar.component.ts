import {Component} from "@angular/core";
import {OpenMaterialDialogService} from "../shared/open-material-dialog.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html'
})
export class SidebarComponent {

  constructor(private openMaterialDialogService: OpenMaterialDialogService) {
  }

  create(): void {
    console.log("working");
    this.openMaterialDialogService.open();
  }
}
