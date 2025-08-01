import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { Task } from '../../../../services/task/task';

@Component({
  selector: 'app-view-task-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-task-dialog.html',
  styleUrl: './view-task-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewTaskDialog implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();

   constructor(private _taskServices: Task, private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: {
    id: string, 
    name: string,
    description: string,
  }) {}

   onCancel(): void {
    this.dialogRef.close(false)
  }

  viewTaskById(): void {
      this._taskServices.viewTaskById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.data = res.data
    
    })
  }

  ngOnInit(): void {
    console.log(this.data.id, 'id');
    this.viewTaskById()
  }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }
  }
