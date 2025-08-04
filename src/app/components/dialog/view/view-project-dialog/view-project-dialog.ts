import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { Project } from '../../../../services/project/project';

@Component({
  selector: 'app-view-project-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-project-dialog.html',
  styleUrl: './view-project-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProjectDialog implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
  
     constructor(private _projServices: Project, private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewProjectDialog>, @Inject(MAT_DIALOG_DATA) public data: {
      id: string, 
      joc: number, 
      designName: string, 
      allow_for_off_time: boolean, 
      description: string
    }) {}
  
     onCancel(): void {
      this.dialogRef.close(false)
    }
  
    viewProjectById(): void {
        this._projServices.viewProjectById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.data = res.data
      })
    }
  
    ngOnInit(): void {
      console.log(this.data.id, 'id');
      this.viewProjectById()
    }
  
      ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
      }
    
}
