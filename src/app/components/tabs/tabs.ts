import { ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeDialog } from '../add-employee-dialog/add-employee-dialog';
import { MatMenuModule } from '@angular/material/menu';
import { EditEmployeeDialog } from '../edit-employee-dialog/edit-employee-dialog';

export interface PeriodicElement {
  name: string;
  position: number;
  email: number;
  phone: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', email: 1.0079, phone: 'H'},
  {position: 2, name: 'Helium', email: 4.0026, phone: 'He'},
  {position: 3, name: 'Lithium', email: 6.941, phone: 'Li'},
  {position: 4, name: 'Beryllium', email: 9.0122, phone: 'Be'},
  {position: 5, name: 'Boron', email: 10.811, phone: 'B'},
  {position: 6, name: 'Carbon', email: 12.0107, phone: 'C'},
  {position: 7, name: 'Nitrogen', email: 14.0067, phone: 'N'},
  {position: 8, name: 'Oxygen', email: 15.9994, phone: 'O'},
  {position: 9, name: 'Fluorine', email: 18.9984, phone: 'F'},
  {position: 10, name: 'Neon', email: 20.1797, phone: 'Ne'},
  {position: 11, name: 'Sodium', email: 22.9897, phone: 'Na'},
  {position: 12, name: 'Magnesium', email: 24.305, phone: 'Mg'},
  {position: 13, name: 'Aluminum', email: 26.9815, phone: 'Al'},
  {position: 14, name: 'Silicon', email: 28.0855, phone: 'Si'},
  {position: 15, name: 'Phosphorus', email: 30.9738, phone: 'P'},
  {position: 16, name: 'Sulfur', email: 32.065, phone: 'S'},
  {position: 17, name: 'Chlorine', email: 35.453, phone: 'Cl'},
  {position: 18, name: 'Argon', email: 39.948, phone: 'Ar'},
  {position: 19, name: 'Potassium', email: 39.0983, phone: 'K'},
  {position: 20, name: 'Calcium', email: 40.078, phone: 'Ca'},
];

@Component({
  selector: 'app-tabs',
  imports: [MatMenuModule, MatDialogModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatPaginatorModule, MatTableModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs implements AfterViewInit {

  readonly dialog = inject(MatDialog);



  displayedColumns: string[] = ['position', 'name', 'email', 'phone', 'address', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditEmployeeDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
