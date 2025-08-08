import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { TaskAssign } from '../../../../services/task-assign/task-assign';

@Component({
  selector: 'app-view-task-assign-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-task-assign-dialog.html',
  styleUrl: './view-task-assign-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ViewTaskAssignDialog implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
  
     constructor(private _taskAssignService: TaskAssign, private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewTaskAssignDialog>, @Inject(MAT_DIALOG_DATA) public data: {
      id: string, 
      working_hours: number,
      plan_hour: number,
    }) {}
  
     onCancel(): void {
      this.dialogRef.close(false)
    }
  
    viewEmpAssignById(): void {
        this._taskAssignService.viewTaskpAssignById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
