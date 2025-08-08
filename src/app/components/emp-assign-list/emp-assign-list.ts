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
import { EmpAssign } from '../../services/emp-assign/emp-assign';
import { AddEmpAssignDialog } from '../dialog/add-emp-assign-dialog/add-emp-assign-dialog';
import { EditEmpAssignDialog } from '../dialog/edit-emp-assign-dialog/edit-emp-assign-dialog';
import { ViewEmpAssignDialog } from '../dialog/view/view-emp-assign-dialog/view-emp-assign-dialog';

@Component({
  selector: 'app-emp-assign-list',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './emp-assign-list.html',
  styleUrl: './emp-assign-list.scss'
})
export class EmpAssignList implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'serialNo', 
    'user_id', 
    'project_id', 
    'task_id',
    'description', 
    'status', 
    'is_deleted', 
    'action'
  ];
  empAssign: any = new MatTableDataSource([]);
  empAssignCount: any

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _empAssignService: EmpAssign, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _router: Router, private _activeRoute: ActivatedRoute) {}
  
  ngAfterViewInit(): void {
    this.empAssign.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getEmpAssign()
  }

  getEmpAssign(): void {
    forkJoin([
      this._empAssignService.getEmpAssign().pipe(retry(3), catchError(err => of(null))),
      this._empAssignService.countEmpAssign().pipe(retry(3), catchError(err => of(null)))

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      empAssignment,
      empAssignmentCount
    ]) => {
      this.empAssign = empAssignment
      this.empAssignCount = empAssignmentCount.count
      console.log(this.empAssign, 'assign');
      console.log(this.empAssignCount, 'assignCount');
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onAddEmpAssignDialog(): void {
    const dialogRef = this._matdialog.open(AddEmpAssignDialog, {
      width: '1000px'
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.getEmpAssign()
    })
  }

  onEditEmpAssignDialog(data: any): void {
    const dialogRef = this._matdialog.open(EditEmpAssignDialog, {
      width: '1000px',
      data: {data}
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.getEmpAssign()
    })
  }

   onViewEmpAssignDialog(id: string, working_hours: number, plan_hour: number): void {
    const dialogRef = this._matdialog.open(ViewEmpAssignDialog, {
      width: '1000px',
      data: {
        id: id,
        working_hours: working_hours,
        plan_hour: plan_hour
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.getEmpAssign()
    })
  }

   onDelete(id: string): void {
    const dialogRef = this._matdialog.open(ConfirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this emp assign?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._empAssignService.deleteEmpAssign(id).subscribe({
          next: (response) => {
            if (response.success) {
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
            this.getEmpAssign()

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
        const element = this.empAssign.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._empAssignService.toggleDeleted(id).subscribe({
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
}
