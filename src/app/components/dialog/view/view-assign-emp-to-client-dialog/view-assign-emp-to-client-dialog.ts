import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { EmpAlloc } from '../../../../services/emp-alloc/emp-alloc';

@Component({
  selector: 'app-view-assign-emp-to-client-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-assign-emp-to-client-dialog.html',
  styleUrl: './view-assign-emp-to-client-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAssignEmpToClientDialog implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  empAlloc: any[] = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    id: string,
    name: string,
    cliName: string,
    project_name: string,
    description: string
  }, private _empAllocService: EmpAlloc, private cdr: ChangeDetectorRef, private dialogRef: MatDialogRef<ViewAssignEmpToClientDialog>) {}

  onCancel(): void {
    this.dialogRef.close(false)
  }
    
  viewEmpAllocById(): void {
    this._empAllocService.viewAllocEmpById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.data = res.data
    })
  }

  ngOnInit(): void {
    this.viewEmpAllocById()
  }
  
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
