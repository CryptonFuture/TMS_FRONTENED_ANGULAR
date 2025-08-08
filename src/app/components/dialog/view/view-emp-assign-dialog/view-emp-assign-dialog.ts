import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { EmpAssign } from '../../../../services/emp-assign/emp-assign';

@Component({
  selector: 'app-view-emp-assign-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-emp-assign-dialog.html',
  styleUrl: './view-emp-assign-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewEmpAssignDialog implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

   constructor(private _empAssignService: EmpAssign, private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewEmpAssignDialog>, @Inject(MAT_DIALOG_DATA) public data: {
    id: string, 
    working_hours: number,
    plan_hour: number,
  }) {}

   onCancel(): void {
    this.dialogRef.close(false)
  }

  viewEmpAssignById(): void {
      this._empAssignService.viewEmpAssignById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.data = res.data
    })
  }

  ngOnInit(): void {
    console.log(this.data.id, 'id');
    this.viewEmpAssignById()
  }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }
}
