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
import { AddClientDialog } from '../dialog/add-client-dialog/add-client-dialog';
import { EditClientDialog } from '../dialog/edit-client-dialog/edit-client-dialog';
import { Client } from '../../services/client/client';
import { ViewClientDialog } from '../dialog/view/view-client-dialog/view-client-dialog';

export interface Clients {
  serialNo: number;
  name: string;
  email: string;
  password: string;
  confirmPass: string;
  description: string;
  start_time: string;
  end_time: string
  status: string;
}


@Component({
  selector: 'app-existing-client',
  imports: [MatSortModule, CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule],
  templateUrl: './existing-client.html',
  styleUrl: './existing-client.scss'
})
export class ExistingClient implements AfterViewInit, OnDestroy, OnInit {

    displayedColumns: string[] = ['serialNo', 'name', 'email', 'description', 'start_time', 'end_time', 'status', 'is_deleted', 'action'];
    existClient: any = new MatTableDataSource([]);
    existCount: any
    private destroy$ = new Subject<void>();

    constructor(private _clientService: Client, private _taskServies: Task, private _matdialog: MatDialog, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _empServices: Employee, private _router: Router, private _activeRoute: ActivatedRoute) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit(): void {
      this.existClient.paginator = this.paginator;
    }

    ngOnInit(): void {
      this.getClientCount()
    }

    getClientCount(): void {
      forkJoin([
        this._clientService.getExistingClient().pipe(retry(3), catchError(err => of(null))),
        this._clientService.countExistingClient().pipe(retry(3), catchError(err => of(null)))
      ]).pipe(takeUntil(this.destroy$)).subscribe(([
        existingClient,
        countExisting
      ]) => {
        this.existClient = existingClient
        this.existCount = countExisting.count
        console.log(this.existClient, 'exist');
        console.log(this.existCount, 'count');
        
        
        this.cdr.detectChanges()
      })

    }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }

    onAddClientDialog(): void {
      const dialogRef = this._matdialog.open(AddClientDialog, {
        width: '1000px'
      })

      dialogRef.afterClosed().subscribe((result) => {
        this.getClientCount()
      })
    }

    onEditClientDialog(data: any): void {
      const dialogRef = this._matdialog.open(EditClientDialog, {
        width: '1000px',
        data: {data}
      })

      dialogRef.afterClosed().subscribe((result) => {
        this.getClientCount()
      })
    }

    onViewClientDialog(id: any, name: string, email: string, phone: string, address: string): void {
       const dialogRef = this._matdialog.open(ViewClientDialog, {
        width: '1000px',
        data: {
          id: id, 
          name: name,
          email: email,
          phone: phone,
          address: address
        }
      })

      dialogRef.afterClosed().subscribe((result) => {

      })
    }

    onDelete(id: string): void {
      const dialogRef = this._matdialog.open(ConfirmDialog, {
        width: '300px',
        data: { message: 'Are you sure you want to delete this existing client?' }
      });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._clientService.deleteClient(id).subscribe({
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
            this.getClientCount()

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
        const element = this.existClient.find((item: any) => item._id === id);
         element.is_deleted = !element.is_deleted;
          element.is_deleted = true;
        if (element) {
            this._clientService.toggleDeleted(id).subscribe({
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
