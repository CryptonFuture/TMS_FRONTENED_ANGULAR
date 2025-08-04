import { Component, OnDestroy, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../services/employee/employee';
import { catchError, forkJoin, of, retry, Subject, takeUntil } from 'rxjs';
import { DesDep } from '../../../services/desDep/des-dep';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { createTaskForm, updateTaskForm } from '../../auth-forms/task/task.form';
import { Project } from '../../../services/project/project';
import { updateProjectForm, approvalProjectForm } from '../../auth-forms/project/project.form';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Approval } from '../../../services/approval/approval';

@Component({
  selector: 'app-approval-dialog',
  imports: [MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './approval-dialog.html',
  styleUrl: './approval-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class ApprovalDialog implements OnInit, OnDestroy {

  approvalProjectForm: FormGroup
  des: any[] = []
  projectStatus: any[] = []

  private destroy$ = new Subject<void>();

  constructor(private _approvalServices: Approval, private _projServices: Project, private dialogRef: MatDialogRef<ApprovalDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder,  @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
    this.approvalProjectForm = approvalProjectForm(this.fb)
  }

  get f() {
    return this.approvalProjectForm.controls; 
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }

  ngOnInit(): void {
     this._projServices.editProjectById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.approvalProjectForm.patchValue({
          project_code: response.data.project_code,
          project_name: response.data.project_name,
          working_hours: response.data.working_hours,
          joc: response.data.joc,
          designName: response.data.designName,
          project_manager_id: response.data.project_manager_id,
          client_id: response.data.client_id,
          manager_id: response.data.manager_id,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          allow_for_off_time: response.data.allow_for_off_time,
          description: response.data.description,
          status: response.data.status,
          projectStatus: response.data.projectStatus
        })
         
      })
    this.getDesDepProjectStatus()
  }

   getDesDepProjectStatus(): void {
      forkJoin([
        this._desDep.getDesDep().pipe(retry(3), catchError(err => of(null))),
        this._projServices.projectStatus().pipe(retry(3), catchError(err => of(null)))
      ]).pipe(takeUntil(this.destroy$)).subscribe(([
        designation,
        projStatus,
        
      ]) => {
        this.des = designation.designation
        this.projectStatus = projStatus      
      
        this.cdr.detectChanges()
      })
    }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

   onCompleted(): void {
      if(this.approvalProjectForm.invalid) {
        return
      }
        this.approvalProjectForm.get('remarks')?.disable();
      const remarksValue = this.approvalProjectForm.get('remarks')?.value;

      this._approvalServices.updateApprovalCompletedProject(this.data.data, {remarks: remarksValue}).subscribe({
        next: (response) => {
          this.approvalProjectForm.get('remarks')?.enable();
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.approvalProjectForm.get('remarks')?.reset();
              Object.keys(this.approvalProjectForm.controls).forEach(key => {
                this.approvalProjectForm.get(key)?.setErrors(null);
              });
              setTimeout(() => {
                this.dialogRef.close()
              }, 1500)
            } else {
              console.log(response.error?.error);
              
               this._snackBar.open(response.error?.error || 'Login failed. Please try again.', 'x', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            }
        },
        error: (err) => {
           this.approvalProjectForm.get('remarks')?.enable();
          console.log(err);
  
        Object.keys(this.approvalProjectForm.controls).forEach(key => {
          this.approvalProjectForm.get(key)?.setErrors(null);
        });
  
        this._snackBar.open('Something went wrong. Please try again.', 'x', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
          
        }
      })
   }

   onRejected(): void {
      if(this.approvalProjectForm.invalid) {
        return
      }

      this.approvalProjectForm.get('remarks')?.disable();

      const remarksValue = this.approvalProjectForm.get('remarks')?.value;

      this._approvalServices.updateApprovalRejectedProject(this.data.data, {remarks: remarksValue}).subscribe({
        next: (response) => {
            this.approvalProjectForm.get('remarks')?.enable();

           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.approvalProjectForm.get('remarks')?.reset();
              Object.keys(this.approvalProjectForm.controls).forEach(key => {
                this.approvalProjectForm.get(key)?.setErrors(null);
              });
              setTimeout(() => {
                this.dialogRef.close()
              }, 1500)
            } else {
              console.log(response.error?.error);
              
               this._snackBar.open(response.error?.error || 'Login failed. Please try again.', 'x', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            }
        },
        error: (err) => {
          this.approvalProjectForm.get('remarks')?.enable();
          console.log(err);
  
        Object.keys(this.approvalProjectForm.controls).forEach(key => {
          this.approvalProjectForm.get(key)?.setErrors(null);
        });
  
        this._snackBar.open('Something went wrong. Please try again.', 'x', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
          
        }
      })
   }

  
}
