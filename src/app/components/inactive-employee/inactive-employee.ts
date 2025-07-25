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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _empServices: Employee) {}

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

    toggleStatus(id: string, active: boolean): void {
      this._empServices.toggleStatus(id, active).subscribe({
        next: (response) => {
           if(response.success) {
             this._snackBar.open(response.message, 'x', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            })

          } else {
             this._snackBar.open(response.error || 'Login failed. Please try again.', 'x', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
          this.getInActiveEmp()
        },
        error: (err) => {
            const errorMessage = err?.error?.error || 'Something went wrong on server.';
            this._snackBar.open(errorMessage, 'x', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
        }
      })
    }

    toggleAdmin(employee: any): void {
      const updateStatus = !employee.is_admin
      this._empServices.toggleAdmin(employee._id, updateStatus).subscribe({
        next: (response) => {
          employee.is_admin = updateStatus;
          this.cdr.detectChanges()

           if(response.success) {
             this._snackBar.open(response.message, 'x', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            })

          } else {
             this._snackBar.open(response.error || 'Login failed. Please try again.', 'x', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        },
        error: (err) => {
            const errorMessage = err?.error?.error || 'Something went wrong on server.';
            this._snackBar.open(errorMessage, 'x', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
        }
      })
    }
  
}
