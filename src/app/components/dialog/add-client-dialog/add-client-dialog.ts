import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
import { createClientForm, updateClientForm } from '../../auth-forms/client/client.form';


@Component({
  selector: 'app-add-client-dialog',
  imports: [MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-client-dialog.html',
  styleUrl: './add-client-dialog.scss',
  providers: [provideNativeDateAdapter()]

})
export class AddClientDialog implements OnInit, OnDestroy {
    clientForm: FormGroup

    constructor(private _clientService: Client, private _projServices: Project, private dialogRef: MatDialogRef<AddClientDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder) {
        this.clientForm = createClientForm(this.fb)
    }

    get f() {
      return this.clientForm.controls; 
    }

    onCancel(): void {
      this.dialogRef.close(false)
    }

    ngOnInit(): void {
      
    }

    ngOnDestroy(): void {
      
    }

    onSubmit(): void {
      if(this.clientForm.invalid) {
        return
      }
    this.clientForm.disable()
      this._clientService.addClient(this.clientForm.value).subscribe({
        next: (response) => {
          this.clientForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.clientForm.reset()
              Object.keys(this.clientForm.controls).forEach(key => {
                this.clientForm.get(key)?.setErrors(null);
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
          this.clientForm.enable()
          console.log(err);
  
        Object.keys(this.clientForm.controls).forEach(key => {
          this.clientForm.get(key)?.setErrors(null);
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
