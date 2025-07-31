import {  ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
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
import { catchError, debounceTime, distinctUntilChanged, forkJoin, of, retry, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog/confirm-dialog';
import { ViewEmployeeDialog } from '../dialog/view/view-employee-dialog/view-employee-dialog';
import { FormControl, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskDialog } from '../dialog/add-task-dialog/add-task-dialog';
import { Task } from '../../services/task/task';
import { ViewTaskDialog } from '../dialog/view/view-task-dialog/view-task-dialog';
import { EditTaskDialog } from '../dialog/edit-task-dialog/edit-task-dialog';
import { CommonModule } from '@angular/common';

export interface Tasks {
  serialNo: number;
  name: string;
  description: string;
  client_id: string;
  status: string;
}

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements AfterViewInit, OnDestroy, OnInit  {

  displayedColumns: string[] = ['serialNo', 'name', 'description', 'client_id', 'status', 'is_deleted', 'action'];
  task: any = new MatTableDataSource([]);
  taskCount: any

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _taskServies: Task, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _empServices: Employee, private _router: Router, private _activeRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.task.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getTask()
  }

  getTask(): void {
    forkJoin([
      this._taskServies.getTask().pipe(retry(3), catchError(err => of(null))),
      this._taskServies.countTask().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      task,
      taskcount
    ]) => {
      this.task = task,
      this.taskCount = taskcount.count
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onAddTaskDialog(): void {
    const dialogRef = this._matdialog.open(AddTaskDialog, {
      width: '1000px'
    })

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      this.getTask()
    })
  }

  onEditTaskDialog(data: any): void {
    const dialogRef = this._matdialog.open(EditTaskDialog, {
      width: '1000px',
      data: {data}
    })

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      this.getTask()
    })
  }

  onViewTaskDialog(id: string, name: string, description: string): void {
    const dialogRef = this._matdialog.open(ViewTaskDialog, {
      width: '1000px',
      data: {
        id: id,
        name: name,
        description: description
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    })
  }

  onDelete(id: string): void {
    const dialogRef = this._matdialog.open(ConfirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this employee?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._taskServies.deleteTask(id).subscribe({
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
            this.getTask()

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
        const element = this.task.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._taskServies.toggleDeleted(id).subscribe({
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

