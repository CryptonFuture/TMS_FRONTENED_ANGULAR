import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeDialog } from '../../dialog/add-employee-dialog/add-employee-dialog';
import { MatMenuModule } from '@angular/material/menu';
import { EditEmployeeDialog } from '../../dialog/edit-employee-dialog/edit-employee-dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Router, ActivatedRoute, RouterModule, RouterLink, RouterLinkActive } from '@angular/router'
import { Employee } from '../../../services/employee/employee';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, of, retry, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../confirm-dialog/confirm-dialog/confirm-dialog';
import { ViewEmployeeDialog } from '../../dialog/view/view-employee-dialog/view-employee-dialog';
import { FormControl, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskDialog } from '../../dialog/add-task-dialog/add-task-dialog';
import { Task } from '../../../services/task/task';
import { ViewTaskDialog } from '../../dialog/view/view-task-dialog/view-task-dialog';
import { EditTaskDialog } from '../../dialog/edit-task-dialog/edit-task-dialog';
import { CommonModule } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { Project } from '../../../services/project/project';
import { AddProjectDialog } from '../../dialog/add-project-dialog/add-project-dialog';
import { ViewProjectDialog } from '../../dialog/view/view-project-dialog/view-project-dialog';
import { EditProjectDialog } from '../../dialog/edit-project-dialog/edit-project-dialog';

export interface Projects {
  serialNo: Number,
  project_code: Number;
  project_name: String,
  working_hours: Date,
  joc: Number,
  designation: string,
  project_manager_id: string,
  client_id: string,
  manager_id: string,
  start_date: Date,
  end_date: Date,
  allow_for_off_time: boolean,
  description: String,
  status: boolean
}

@Component({
  selector: 'app-inactive-project-list',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './inactive-project-list.html',
  styleUrl: './inactive-project-list.scss'
})
export class InactiveProjectList implements AfterViewInit, OnDestroy, OnInit {
  displayedColumns: string[] = [
    'serialNo', 
    'project_code', 
    'project_name', 
    'working_hours',
    'status',
    'is_deleted',
    'is_allow_off_time',
    'action'];
  InActiveProject: any = new MatTableDataSource([]);
  projectInActiveCount: any
  private destroy$ = new Subject<void>();

  constructor(private _projServices: Project, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _router: Router, private _activeRoute: ActivatedRoute) {}

   @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.InActiveProject.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getInActiveProject()
  }

  getInActiveProject(): void {
    forkJoin([
      this._projServices.getInActiveProject().pipe(retry(3), catchError(err => of(null))),
      this._projServices.InActiveCountProject().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      project,
      inActiveProj
    ]) => {
      this.InActiveProject = project,
      this.projectInActiveCount = inActiveProj.count
      
      console.log(this.InActiveProject, 'task');
      
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
      data: { message: 'Are you sure you want to delete this project?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._projServices.deleteProject(id).subscribe({
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
            this.getInActiveProject()

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

    toggleIsAllow(project: any): void {
      const updateStatus = !project.allow_for_off_time
      this._projServices.toggleIsAllow(project._id, updateStatus).subscribe({
        next: (response) => {
          project.allow_for_off_time = updateStatus;
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
        const element = this.InActiveProject.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._projServices.toggleDeleted(id).subscribe({
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
  
        onEditProjectDialog(data: any): void {
          const dialogRef = this._matdialog.open(EditProjectDialog, {
            width: '1000px',
            data: {data}
          })

          dialogRef.afterClosed().subscribe((result) => {
            this.getInActiveProject()
          })
        }

        onViewProjectDialog(id: string, joc: number, designName: string, allow_for_off_time: boolean, description: string): void {
          const dialogRef = this._matdialog.open(ViewProjectDialog, {
            width: '1000px',
            data: {
              id: id,
              joc: joc,
              designName: designName,
              allow_for_off_time: allow_for_off_time,
              description: description
            }
          })

          dialogRef.afterClosed().subscribe((result) => {

          })
        }
}
