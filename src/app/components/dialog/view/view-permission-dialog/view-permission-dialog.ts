import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { Task } from '../../../../services/task/task';
import { Permission } from '../../../../services/permission/permission';

@Component({
  selector: 'app-view-permission-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-permission-dialog.html',
  styleUrl: './view-permission-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewPermissionDialog implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

   constructor(private _permissionService: Permission, private _taskServices: Task, private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewPermissionDialog>, @Inject(MAT_DIALOG_DATA) public data: {
    id: string, 
    name: string,
    description: string,
  }) {}

   onCancel(): void {
    this.dialogRef.close(false)
  }

  viewPermissionById(): void {
      this._permissionService.viewPermissionById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.data = res.data
    
    })
  }

  ngOnInit(): void {
    console.log(this.data.id, 'id');
    this.viewPermissionById()
  }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }
}
