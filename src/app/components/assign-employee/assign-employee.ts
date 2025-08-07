import {  ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { Router, ActivatedRoute, RouterModule, RouterLink, RouterLinkActive } from '@angular/router'
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, of, retry, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog/confirm-dialog';
import { FormControl, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { EmpAlloc } from '../../services/emp-alloc/emp-alloc';
import { EditAssignEmpToClient } from '../dialog/edit-assign-emp-to-client/edit-assign-emp-to-client';
import { ViewAssignEmpToClientDialog } from '../dialog/view/view-assign-emp-to-client-dialog/view-assign-emp-to-client-dialog';

@Component({
  selector: 'app-assign-employee',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './assign-employee.html',
  styleUrl: './assign-employee.scss'
})
export class AssignEmployee implements OnDestroy, OnInit, AfterViewInit {
 displayedColumns: string[] = ['serialNo', 'emp_name', 'proj_name', 'client_name', 'description', 'status', 'is_deleted', 'action'];
  assignEmpToCli: any = new MatTableDataSource([]);
  assignCountEmpToClient: any
  private destroy$ = new Subject<void>();
    
  constructor(private _empAllocService: EmpAlloc, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _router: Router, private _activeRoute: ActivatedRoute) {}
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
     this.assignEmpToCli.paginator = this.paginator;
  }

  ngOnInit(): void {
   this.getAssignCountEmp()
  }

  getAssignCountEmp(): void {
    forkJoin([
      this._empAllocService.getAssignToClientEmp().pipe(retry(3), catchError(err => of(null))),
      this._empAllocService.assignEmpToClientCount().pipe(retry(3), catchError(err => of(null)))

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      assignToClientEmployee,
      assignCountEmployee
    ]) => {
      this.assignEmpToCli = assignToClientEmployee
      this.assignCountEmpToClient = assignCountEmployee.count 

      console.log( this.assignEmpToCli, ' this.assignEmp');
      
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


      onDelete(id: string): void {
      const dialogRef = this._matdialog.open(ConfirmDialog, {
        width: '300px',
        data: {message: 'Are you sure you want to delete this assign emp?'}
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if(confirmed) {
           this._empAllocService.deleteAllocEmp(id).subscribe({
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
          this.getAssignCountEmp()

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

      toggleDeleted(id: string): void {
        const element = this.assignEmpToCli.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._empAllocService.toggleDeleted(id).subscribe({
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

      onEditAssignEmpToClient(data: any): void {
        const dialogRef = this._matdialog.open(EditAssignEmpToClient, {
          width: '1000px',
          data: {data}
        })

        dialogRef.afterClosed().subscribe((result) => {
          this.getAssignCountEmp()
        })
      }

      onViewAssignEmpToClient(id: string, name: string, cliName: string, project_name: string, description: string): void {
          const dialogRef = this._matdialog.open(ViewAssignEmpToClientDialog, {
          width: '1000px',
          data: {
            id: id,
            name: name,
            cliName: cliName,
            project_name: project_name,
            description: description
          }
        })

        dialogRef.afterClosed().subscribe((result) => {
          this.getAssignCountEmp()
        })
      }
  

}
