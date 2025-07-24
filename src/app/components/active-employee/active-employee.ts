import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeDialog } from '../dialog/add-employee-dialog/add-employee-dialog';
import { MatMenuModule } from '@angular/material/menu';
import { EditEmployeeDialog } from '../dialog/edit-employee-dialog/edit-employee-dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Router, ActivatedRoute, RouterModule, RouterLink, RouterLinkActive } from '@angular/router'
import { Employee } from '../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';

export interface PeriodicElement {
  name: string;
  serialNo: number;
  email: number;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-active-employee',
  imports: [MatMenuModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './active-employee.html',
  styleUrl: './active-employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveEmployee implements AfterViewInit, OnDestroy, OnInit {


  displayedColumns: string[] = ['serialNo', 'name', 'email', 'phone', 'address', 'status', 'action'];
  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject<void>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cdr: ChangeDetectorRef, private _empServices: Employee, private _router: Router, private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
     this.getActiveEmp()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getActiveEmp(): void {
   this._empServices.getActiveEmp().pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.dataSource = response
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

    onNavigateAddEmployeeForm(): void {
    this._router.navigate(['add-employee'])
  }

    onNavigateEditEmployeeForm(): void {
    this._router.navigate(['edit-employee'])
  }

}
