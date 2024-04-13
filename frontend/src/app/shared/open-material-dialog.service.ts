import {Injectable} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/portal";

@Injectable()
export class OpenMaterialDialogService {
  constructor(private matDialog: MatDialog) {
  }

  openModal<T, D, R>(component: ComponentType<T>, data?: D, panelClass?: string[]): MatDialogRef<T, R> {
    return this.matDialog.open<T, D, R>(component, {
      data,
      minWidth: "90vw",
      minHeight: "90vh",
      panelClass: panelClass,
      disableClose: true
    });
  }

/*   open() {
    this.openModal<CreateClassComponent, string, boolean>(CreateClassComponent, "huehue", ["material"])
      .afterClosed().toPromise().then(boolean => console.log(boolean));
  } */
}
