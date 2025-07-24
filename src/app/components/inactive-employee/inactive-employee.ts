import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
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
  selector: 'app-inactive-employee',
  imports: [MatMenuModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './inactive-employee.html',
  styleUrl: './inactive-employee.scss'
})
export class InactiveEmployee implements AfterViewInit, OnInit, OnDestroy {

  displayedColumns: string[] = ['serialNo', 'name', 'email', 'phone', 'address', 'status', 'action'];
  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject<void>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cdr: ChangeDetectorRef, private _empServices: Employee) {}

  ngOnInit(): void {
     this.getInActiveEmp()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getInActiveEmp(): void {
     this._empServices.getInActiveEmp().pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.dataSource = response
        this.cdr.detectChanges()
      })
    }
  
    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }
  
}
