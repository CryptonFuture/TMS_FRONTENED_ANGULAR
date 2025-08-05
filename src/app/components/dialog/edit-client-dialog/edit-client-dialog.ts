import { Component, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core';
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
import { createEmployeeForm } from '../../auth-forms/employee/employee.form';
import { catchError, forkJoin, of, retry, Subject, takeUntil } from 'rxjs';
import { DesDep } from '../../../services/desDep/des-dep';
import { User } from '../../../services/auth/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { createTaskForm, updateTaskForm } from '../../auth-forms/task/task.form';
import { Project } from '../../../services/project/project';
import { createProjectForm } from '../../auth-forms/project/project.form';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Client } from '../../../services/client/client';
import { updateClientForm } from '../../auth-forms/client/client.form';

@Component({
  selector: 'app-edit-client-dialog',
  imports: [MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-client-dialog.html',
  styleUrl: './edit-client-dialog.scss',
  providers: [provideNativeDateAdapter()]

})
export class EditClientDialog implements OnInit, OnDestroy {
    editClientForm: FormGroup
    private destroy$ = new Subject<void>();

   constructor(@Inject(MAT_DIALOG_DATA) public data: {data: any}, private _clientService: Client, private _projServices: Project, private dialogRef: MatDialogRef<EditClientDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder) {
    this.editClientForm = updateClientForm(this.fb)
    
  }

   get f() {
    return this.editClientForm.controls; 
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }

    ngOnInit(): void {
      this._clientService.editClientById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.editClientForm.patchValue({
         name: response.data.name,
         email: response.data.email,
         phone: response.data.phone,
         address: response.data.address,
         startTime: response.data.startTime,
         endTime: response.data.endTime,
         description: response.data.description,
         status: response.data.status
        })

        console.log(response, 'res');
        this.cdr.detectChanges()
         
      })

    }

    ngOnDestroy(): void {
       this.destroy$.next()
       this.destroy$.complete()
    }

    onSubmit(): void {
      if(this.editClientForm.invalid) {
        return
      }

      this.editClientForm.disable()
      this._clientService.updateClient(this.data.data, this.editClientForm.value).subscribe({
        next: (response) => {
          this.editClientForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.editClientForm.reset()
              Object.keys(this.editClientForm.controls).forEach(key => {
                this.editClientForm.get(key)?.setErrors(null);
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
          this.editClientForm.enable()
          console.log(err);
  
        Object.keys(this.editClientForm.controls).forEach(key => {
          this.editClientForm.get(key)?.setErrors(null);
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
