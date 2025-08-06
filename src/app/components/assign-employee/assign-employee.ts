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

@Component({
  selector: 'app-assign-employee',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './assign-employee.html',
  styleUrl: './assign-employee.scss'
})
export class AssignEmployee implements OnDestroy, OnInit, AfterViewInit {
 displayedColumns: string[] = ['serialNo', 'emp_name', 'proj_name', 'client_name', 'description', 'status', 'is_deleted', 'action'];
  assignEmp: any = new MatTableDataSource([]);
  assignCountEmp: any
  private destroy$ = new Subject<void>();
    
  constructor(private _empAllocService: EmpAlloc, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _router: Router, private _activeRoute: ActivatedRoute) {}
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
     this.assignEmp.paginator = this.paginator;
  }

  ngOnInit(): void {
   this.getAssignCountEmp()
  }

  getAssignCountEmp(): void {
    forkJoin([
      this._empAllocService.getAssignEmp().pipe(retry(3), catchError(err => of(null))),
      this._empAllocService.assignAllocEmpCount().pipe(retry(3), catchError(err => of(null)))

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      assignEmployee,
      assignCountEmployee
    ]) => {
      this.assignEmp = assignEmployee
      this.assignCountEmp = assignCountEmployee.count 

      console.log( this.assignEmp, ' this.assignEmp');
      
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  

}
