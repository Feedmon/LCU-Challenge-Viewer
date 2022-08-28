import {NgModule} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  imports: [
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
  ]
})
export class MaterialModule {
}
