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
import { TaskAssign } from '../../services/task-assign/task-assign';
import { AddTaskAssignDialog } from '../dialog/add-task-assign-dialog/add-task-assign-dialog';
import { EditTaskAssignDialog } from '../dialog/edit-task-assign-dialog/edit-task-assign-dialog';
import { ViewTaskAssignDialog } from '../dialog/view/view-task-assign-dialog/view-task-assign-dialog';

@Component({
  selector: 'app-task-assign-list',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './task-assign-list.html',
  styleUrl: './task-assign-list.scss'
})
export class TaskAssignList implements OnInit, OnDestroy, AfterViewInit {
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
  taskAssign: any = new MatTableDataSource([]);
  taskAssignCount: any
  searchInputControl: UntypedFormControl = new UntypedFormControl()
  searchQuery: any = ""
  page: number = 1;
  limit: number = 10;

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _taskAssignService: TaskAssign, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _router: Router, private _activeRoute: ActivatedRoute) {}
  

  ngAfterViewInit(): void {
    this.taskAssign.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getTaskAssign()
    this.onSearch()
  }

   onSearch(): void {
      this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(value => value?.trim().toLowerCase())
      ).subscribe(value => {
        this.searchQuery = value
        this.getTaskAssign()
        this.cdr.detectChanges()
       })
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.limit = event.pageSize;
      this.getTaskAssign();
    }


    getTaskAssign(): void {
    forkJoin([
      this._taskAssignService.getTaskAssign(this.searchQuery, this.page, this.limit).pipe(retry(3), catchError(err => of(null))),
      this._taskAssignService.countTaskAssign(this.searchQuery).pipe(retry(3), catchError(err => of(null)))

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      taskAssignment,
      taskAssignmentCount
    ]) => {
      this.taskAssign = taskAssignment
      this.taskAssignCount = taskAssignmentCount.count
      console.log(this.taskAssign, 'assign');
      console.log(this.taskAssignCount, 'assignCount');
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
      data: { message: 'Are you sure you want to delete this task assign?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._taskAssignService.deleteTaskAssign(id).subscribe({
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
            this.getTaskAssign()

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
        const element = this.taskAssign.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._taskAssignService.toggleDeleted(id).subscribe({
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

        onAddTaskAssignDialog(): void {
            const dialogRef = this._matdialog.open(AddTaskAssignDialog, {
              width: '1000px'
            })
        
            dialogRef.afterClosed().subscribe((result) => {
              this.getTaskAssign()
            })
          }

          onEditTaskAssignDialog(data: any): void {
            const dialogRef = this._matdialog.open(EditTaskAssignDialog, {
              width: '1000px',
              data: {data}
            })
        
            dialogRef.afterClosed().subscribe((result) => {
              this.getTaskAssign()
            })
          }

          onViewTaskAssignDialog(id: string, working_hours: number, plan_hour: number): void {
              const dialogRef = this._matdialog.open(ViewTaskAssignDialog, {
                width: '1000px',
                data: {
                  id: id,
                  working_hours: working_hours,
                  plan_hour: plan_hour
                }
              })
              dialogRef.afterClosed().subscribe((result) => {
                this.getTaskAssign()
              })
            }

}
