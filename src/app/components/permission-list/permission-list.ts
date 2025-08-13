import {  ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, of, retry, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog/confirm-dialog';
import { ViewEmployeeDialog } from '../dialog/view/view-employee-dialog/view-employee-dialog';
import { FormControl, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskDialog } from '../dialog/add-task-dialog/add-task-dialog';
import { Task } from '../../services/task/task';
import { ViewTaskDialog } from '../dialog/view/view-task-dialog/view-task-dialog';
import { EditTaskDialog } from '../dialog/edit-task-dialog/edit-task-dialog';
import { CommonModule } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { AdvancedFilterTaskDialog } from '../dialog/add-task-dialog/advanced-filter-task-dialog/advanced-filter-task-dialog';
import { AddPermissionDialog } from '../dialog/add-permission-dialog/add-permission-dialog';
import { Permission } from '../../services/permission/permission';
import { EditPermissionDialog } from '../dialog/edit-permission-dialog/edit-permission-dialog';
import { ViewPermissionDialog } from '../dialog/view/view-permission-dialog/view-permission-dialog';

@Component({
  selector: 'app-permission-list',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.scss'
})
export class PermissionList implements AfterViewInit, OnDestroy, OnInit {
  displayedColumns: string[] = ['serialNo', 'name', 'route', 'role', 'permission', 'status', 'is_deleted', 'action'];
  permission: any = new MatTableDataSource([]);
  permissionCount: any
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _permissionServices: Permission, private _taskServies: Task, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _empServices: Employee, private _router: Router, private _activeRoute: ActivatedRoute) {}


  ngAfterViewInit(): void {
     this.permission.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getCountPermission()
  } 

  getCountPermission(): void {
    forkJoin([
      this._permissionServices.getPermission().pipe(retry(3), catchError(err => of(null))),
      this._permissionServices.countPermission().pipe(retry(3), catchError(err => of(null))),
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      permissions,
      countPermission
    ]) => {
      this.permission = permissions
      this.permissionCount = countPermission.count

      console.log(this.permission, this.permissionCount);
      
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  onAddPermissionDialog(): void {
    const dialogRef = this._matdialog.open(AddPermissionDialog, {
      width: '1000px'
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getCountPermission()
    })
  }

   onEditPermissionDialog(data: any): void {
    const dialogRef = this._matdialog.open(EditPermissionDialog, {
      width: '1000px',
      data: {data}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getCountPermission()
    })
  }

    onViewPermissionDialog(id: any, name: string, description: string): void {
    const dialogRef = this._matdialog.open(ViewPermissionDialog, {
      width: '1000px',
      data: {
        id: id,
        name: name,
        description: description
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      
    })
  }

  onDelete(id: string): void {
    const dialogRef = this._matdialog.open(ConfirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this permission?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._permissionServices.deletePermission(id).subscribe({
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
            this.getCountPermission()

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
        const element = this.permission.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._permissionServices.toggleDeleted(id).subscribe({
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
