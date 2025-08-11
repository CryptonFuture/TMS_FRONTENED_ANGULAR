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
import { UserLogs } from '../../services/user-logs/user-logs';

@Component({
  selector: 'app-user-logs-list',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './user-logs-list.html',
  styleUrl: './user-logs-list.scss'
})
export class UserLogsList implements AfterViewInit, OnDestroy, OnInit {
  displayedColumns: string[] = ['serialNo', 'user_name', 'login_time', 'logout_time', 'createdAt', 'updatedAt'];
  logs: any = new MatTableDataSource([]);
  logsCount: any

  private destroy$ = new Subject<void>();

  constructor(private _userLogs: UserLogs, private cdr: ChangeDetectorRef) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.logs.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getLogsCount()
  }

  getLogsCount(): void {
    forkJoin([
      this._userLogs.getLogs().pipe(retry(3), catchError(err => of(null))),
      this._userLogs.countLogs().pipe(retry(3), catchError(err => of(null)))

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      userLogs,
      userLogsCount
    ]) => {
      this.logs = userLogs,
      this.logsCount = userLogsCount.count

      console.log(this.logs, 'logs');
      console.log(this.logsCount, 'logsCount');

      this.cdr.detectChanges()
      
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
