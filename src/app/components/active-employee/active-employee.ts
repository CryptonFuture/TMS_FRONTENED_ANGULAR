import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, AfterViewInit, inject, OnDestroy, OnInit } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, Subject, takeUntil, forkJoin, retry, catchError, of, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog/confirm-dialog';
import { ViewEmployeeDialog } from '../dialog/view/view-employee-dialog/view-employee-dialog';
import { FormControl, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignEmpToClient } from '../dialog/assign-emp-to-client/assign-emp-to-client';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

export interface PeriodicElement {
  name: string;
  serialNo: number;
  email: number;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-active-employee',
  imports: [ MatMenuModule, FormsModule, MatSortModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './active-employee.html',
  styleUrl: './active-employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveEmployee implements AfterViewInit, OnDestroy, OnInit {


  displayedColumns: string[] = ['serialNo', 'name', 'email', 'phone', 'address', 'status', 'admin', 'action'];
  activeEmp = new MatTableDataSource([]);
  activeCount: any
  searchQuery: any = ""
  page: number = 1;
  limit: number = 10;
  sortField: string = 'name'; 
  sortOrder: string = 'asc';   
  searchInputControl: UntypedFormControl = new UntypedFormControl()
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _empServices: Employee, private _router: Router, private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.getActiveCountEmp()
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
      this.getActiveCountEmp()
      this.cdr.detectChanges()
     })
  }

  onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.limit = event.pageSize;
      this.getActiveCountEmp();
  }

  ngAfterViewInit() {
    this.activeEmp.paginator = this.paginator;
    this.activeEmp.sort = this.sort;
  }

  getActiveCountEmp(): void {
    const sort = `${this.sortField}:${this.sortOrder}`
    forkJoin([
      this._empServices.getActiveEmp(this.searchQuery, this.page, this.limit, sort).pipe(retry(3), catchError(err => of(null))),
      this._empServices.employeeActiveCount(this.searchQuery).pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      activeEmp,
      activecount,
    ]) => {
      this.activeEmp = activeEmp
      this.activeCount = activecount.count
      
      this.cdr.detectChanges()
    })
  }

  // setSort(field: any): void {
  //   if (this.sortField === field) {
  //     this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     this.sortField = field;
  //     this.sortOrder = 'asc';
  //   }
  //   this.getActiveCountEmp();
  // }

  onSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortOrder = sort.direction || 'asc'; // fallback to asc if empty
    this.getActiveCountEmp();
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

    onNavigateAddEmployeeForm(): void {
    this._router.navigate(['add-employee'])
  }

    onNavigateEditEmployeeForm(id: string): void {       
      this._router.navigate(['edit-employee', id])
    }

    onDelete(id: string): void {
      const dialogRef = this._matdialog.open(ConfirmDialog, {
        width: '300px',
        data: {message: 'Are you sure you want to delete this employee?'}
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if(confirmed) {
           this._empServices.deleteEmp(id).subscribe({
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
          this.getActiveCountEmp()

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

    onViewEmployeeDialog(id: string, name: string,email: string, phone: string, address: string): void {
      const dialogRef = this._matdialog.open(ViewEmployeeDialog, {
        width: '1000px',
        data: {
          name: name,
          id: id,
          email: email,
          phone: phone,
          address: address
        }
      }) 

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        
      })
    }

    onAssignEmpToClient(): void {
      const dialogRef = this._matdialog.open(AssignEmpToClient, {
        width: '400px'
      })

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        
      })
    }

    onEditEmployeDialog(data: any): void {
      const dialogRef = this._matdialog.open(EditEmployeeDialog, {
        width: '5000px',
        data: { data }
      })

      dialogRef.afterClosed().subscribe((result) => {
        this.getActiveCountEmp()
      })
    }

    onAddEmployeeDialog(): void {
       const dialogRef = this._matdialog.open(AddEmployeeDialog, {
        width: '5000px'
      })

      dialogRef.afterClosed().subscribe((result) => {
        this.getActiveCountEmp()
      })
    }

}
