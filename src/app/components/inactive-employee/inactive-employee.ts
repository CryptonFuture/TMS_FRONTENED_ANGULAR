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
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog/confirm-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute, RouterModule, RouterLink, RouterLinkActive } from '@angular/router'
import { ViewEmployeeDialog } from '../dialog/view/view-employee-dialog/view-employee-dialog';

export interface PeriodicElement {
  name: string;
  serialNo: number;
  email: number;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-inactive-employee',
  imports: [MatDialogModule, MatMenuModule, CommonModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './inactive-employee.html',
  styleUrl: './inactive-employee.scss'
})
export class InactiveEmployee implements AfterViewInit, OnInit, OnDestroy {

  displayedColumns: string[] = ['serialNo', 'name', 'email', 'phone', 'status', 'active', 'admin', 'deleted', 'action'];
  dataSource: any = new MatTableDataSource([]);

  apiCallInProgress: { [id: string]: boolean } = {};

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _router: Router,private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _empServices: Employee) {}

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

      toggleDeleted(id: string): void {
        const element = this.dataSource.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._empServices.toggleDeleted(id).subscribe({
              next: (response) => {
              
                if(response.success) {
                  this._snackBar.open(response.message, 'x', {
                    duration: 1500,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom'
                  })

                } else {
                  element.is_deleted = false;
                  this._snackBar.open(response.error || 'Login failed. Please try again.', 'x', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom'
                  });
                }
              },
              error: (err) => {
                element.is_deleted = false;
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

        onNavigateEditEmployeeForm(id: string): void {       
          this._router.navigate(['edit-employee', id])
        }

    onDelete(id: string): void {
      const dialogRef = this._matdialog.open(ConfirmDialog, {
        width: '300px',
        data: {message: 'Are you sure you want to delete this employee?'}
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if(confirmed) {
           this._empServices.deleteEmp(id).subscribe({
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
      })
     
    }

    onViewEmployeeDialog(id: string, name: string, email: string, phone: string, address: string): void {
      const dialogRef = this._matdialog.open(ViewEmployeeDialog, {
        width: '1000px',
        data: {
          id: id,
          name: name,
          email: email,
          phone: phone,
          address: address
        }
      }) 

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        
      })
    }
  
}
