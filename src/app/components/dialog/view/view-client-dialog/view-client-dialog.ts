import { Component, ChangeDetectionStrategy, ChangeDetectorRef,  Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { Client } from '../../../../services/client/client';

@Component({
  selector: 'app-view-client-dialog',
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './view-client-dialog.html',
  styleUrl: './view-client-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ViewClientDialog implements OnInit, OnDestroy {

   private destroy$ = new Subject<void>();
    
       constructor(private _clientService: Client, private cdr: ChangeDetectorRef, private _empServices: Employee, private dialogRef: MatDialogRef<ViewClientDialog>, @Inject(MAT_DIALOG_DATA) public data: {
        id: string, 
        name: string, 
        email: string, 
        phone: string, 
        address: string
      }) {}
    
       onCancel(): void {
        this.dialogRef.close(false)
      }
    
      viewProjectById(): void {
        this._clientService.viewClientById(this.data.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
