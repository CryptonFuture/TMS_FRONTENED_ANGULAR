import { ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';

export interface PeriodicElement {
  name: string;
  position: number;
  email: number;
  phone: string;
  address: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', email: 1.0079, phone: 'H', address: 'a'},
  {position: 2, name: 'Helium', email: 4.0026, phone: 'He',  address: 'a'},
  {position: 3, name: 'Lithium', email: 6.941, phone: 'Li',  address: 'a'},
  {position: 4, name: 'Beryllium', email: 9.0122, phone: 'Be',  address: 'a'},
  {position: 5, name: 'Boron', email: 10.811, phone: 'B',  address: 'a'},
  {position: 6, name: 'Carbon', email: 12.0107, phone: 'C',  address: 'a'},
  {position: 7, name: 'Nitrogen', email: 14.0067, phone: 'N',  address: 'a'},
  {position: 8, name: 'Oxygen', email: 15.9994, phone: 'O',  address: 'a'},
  {position: 9, name: 'Fluorine', email: 18.9984, phone: 'F',  address: 'a'},
  {position: 10, name: 'Neon', email: 20.1797, phone: 'Ne',  address: 'a'},
  {position: 11, name: 'Sodium', email: 22.9897, phone: 'Na',  address: 'a'},
  {position: 12, name: 'Magnesium', email: 24.305, phone: 'Mg',  address: 'a'},
  {position: 13, name: 'Aluminum', email: 26.9815, phone: 'Al',  address: 'a'},
  {position: 14, name: 'Silicon', email: 28.0855, phone: 'Si',  address: 'a'},
  {position: 15, name: 'Phosphorus', email: 30.9738, phone: 'P',  address: 'a'},
  {position: 16, name: 'Sulfur', email: 32.065, phone: 'S',  address: 'a'},
  {position: 17, name: 'Chlorine', email: 35.453, phone: 'Cl',  address: 'a'},
  {position: 18, name: 'Argon', email: 39.948, phone: 'Ar',  address: 'a'},
  {position: 19, name: 'Potassium', email: 39.0983, phone: 'K',  address: 'a'},
  {position: 20, name: 'Calcium', email: 40.078, phone: 'Ca',  address: 'a'},
];

@Component({
  selector: 'app-active-employee',
  imports: [MatMenuModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './active-employee.html',
  styleUrl: './active-employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveEmployee implements AfterViewInit {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['position', 'name', 'email', 'phone', 'address', 'status', 'action'];
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
