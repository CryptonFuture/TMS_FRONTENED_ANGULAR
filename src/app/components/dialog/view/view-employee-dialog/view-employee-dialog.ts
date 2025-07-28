import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'


export interface PeriodicElement {
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-view-employee-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-employee-dialog.html',
  styleUrl: './view-employee-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ViewEmployeeDialog implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewEmployeeDialog>, @Inject(MAT_DIALOG_DATA) public data: {
    id: string, 
    name: string,
    email: string,
    phone: string,
    address: string
  }) {}

   onCancel(): void {
    this.dialogRef.close(false)
  }

  viewEmpById(): void {
      this._empServices.viewEmpById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.data = res.data
    })
  }

  ngOnInit(): void {
    console.log(this.data.id, 'id');
    this.viewEmpById()
  }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }
}
