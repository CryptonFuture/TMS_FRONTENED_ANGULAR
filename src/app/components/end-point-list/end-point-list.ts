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
import { CommonModule, JsonPipe } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { AdvancedFilterTaskDialog } from '../dialog/add-task-dialog/advanced-filter-task-dialog/advanced-filter-task-dialog';
import { EndPoints } from '../../services/end-points/end-points';

@Component({
  selector: 'app-end-point-list',
  imports: [JsonPipe, MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './end-point-list.html',
  styleUrl: './end-point-list.scss'
})
export class EndPointList implements AfterViewInit, OnInit, OnDestroy {

  columnsToDisplay = ['name', 'endPoints'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'epJson'];

  epRoutes: any = new MatTableDataSource([]);
  ePCount: any
  activeEmpJson: any
  InActiveEmpJson: any
  EmpJson: any
  ActiveCount: any
  InActiveCount: any

  showActiveJson: boolean = false;
  showInActiveJson: boolean = false;
  showInEmpJson: boolean = false;
  showActiveCountJson: boolean = false;
  showInActiveCountJson: boolean = false;

  private destroy$ = new Subject<void>();
  expandedElement: any | null;

   constructor(private _empServices: Employee, private _epPointServices: EndPoints, private cdr: ChangeDetectorRef) {}

   @ViewChild(MatPaginator) paginator!: MatPaginator;

  isExpanded(element: any) {
    return this.expandedElement === element;
  }

  toggle(element: any) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

   ngAfterViewInit(): void {
    this.epRoutes.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getEpRoutes()
  }

  fetchActiveEmp(): void {
  
    if (this.showActiveJson) {
      this.showActiveJson = false;
      return;
    }

    this._empServices.getActiveEmp().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.activeEmpJson = res
      this.showActiveJson = true;

      

      this.cdr.detectChanges()
    })
  }

  fetchInActiveEmp(): void {
    if (this.showInActiveJson) {
      this.showInActiveJson = false;
      return;
    }

    this._empServices.getInActiveEmp().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.InActiveEmpJson = res
      this.showInActiveJson = true;

      
      this.cdr.detectChanges()
    })
  }

  fetchEmpCount(): void {
    if (this.showInEmpJson) {
      this.showInEmpJson = false;
      return;
    }

    this._empServices.employeeAllCount().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.EmpJson = res
      this.showInEmpJson = true;

      

      this.cdr.detectChanges()
    })
  }

  fetchActiveEmpCount(): void {
    if (this.showActiveCountJson) {
      this.showActiveCountJson = false;
      return;
    }

    this._empServices.employeeActiveCount().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.ActiveCount = res
      this.showActiveCountJson = true;

      

      this.cdr.detectChanges()
    })
  }

  fetchInActiveEmpCount(): void {
    if (this.showInActiveCountJson) {
      this.showInActiveCountJson = false;
      return;
    }

    this._empServices.employeeInActiveCount().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.InActiveCount = res
      this.showInActiveCountJson = true;

      

      this.cdr.detectChanges()
    })
  }

  getEpRoutes(): void {
    forkJoin([
      this._epPointServices.getEp().pipe(retry(3), catchError(err => of(null))),
      this._epPointServices.countEp().pipe(retry(3), catchError(err => of(null))),
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      ep,
      epCount
    ]) => {
      this.epRoutes = ep
      this.ePCount = epCount.count

      console.log(this.epRoutes, 'epRoutes');
      console.log(this.ePCount, 'ePCount');


      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
