import {  ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-reject-project-list',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './reject-project-list.html',
  styleUrl: './reject-project-list.scss'
})
export class RejectProjectList implements AfterViewInit, OnDestroy, OnInit {
  displayedColumns: string[] = [
    'serialNo', 
    'project_code', 
    'project_name', 
    'working_hours',
    'projectstatus'
    ];
  rejectProject: any = new MatTableDataSource([]);
  projectRejectCount: any
  private destroy$ = new Subject<void>();

  constructor(private _projServices: Project, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _router: Router, private _activeRoute: ActivatedRoute) {}

   @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.rejectProject.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getRejectProject()
  }

  getRejectProject(): void {
    forkJoin([
      this._projServices.getRejectProject().pipe(retry(3), catchError(err => of(null))),
      this._projServices.RejectedCountProject().pipe(retry(3), catchError(err => of(null))),

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      project,
      rejProj
    ]) => {
      this.rejectProject = project,
      this.projectRejectCount = rejProj.count
      
      console.log(this.rejectProject, 'task');
      
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
