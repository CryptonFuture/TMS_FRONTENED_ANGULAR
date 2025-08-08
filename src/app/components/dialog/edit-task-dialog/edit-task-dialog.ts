import { Component, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { DesDep } from '../../../services/desDep/des-dep';
import { User } from '../../../services/auth/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { createTaskForm, updateTaskForm } from '../../auth-forms/task/task.form';
import { Task } from '../../../services/task/task';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Client } from '../../../services/client/client';

@Component({
  selector: 'app-edit-task-dialog',
  imports: [MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-task-dialog.html',
  styleUrl: './edit-task-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class EditTaskDialog implements OnInit, OnDestroy {

  editTaskForm: FormGroup
  client: any[] = []
  private destroy$ = new Subject<void>();

  constructor(private _clientService: Client,private _taskServices: Task, private dialogRef: MatDialogRef<EditTaskDialog>, private _snackBar: MatSnackBar, private _userService: User, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
    this.editTaskForm = updateTaskForm(this.fb)
    
  }

   get f() {
    return this.editTaskForm.controls; 
  }

   onCancel(): void {
    this.dialogRef.close(false)
  }

   onSubmit(): void {
      if(this.editTaskForm.invalid) {
        return
      }
      this.editTaskForm.disable()
      this._taskServices.updateTask(this.data.data, this.editTaskForm.value).subscribe({
        next: (response) => {
          this.editTaskForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.editTaskForm.reset()
              Object.keys(this.editTaskForm.controls).forEach(key => {
                this.editTaskForm.get(key)?.setErrors(null);
              });
              setTimeout(() => {
                this.dialogRef.close()
              }, 1500)
            } else {
               this._snackBar.open(response.error?.error || 'Login failed. Please try again.', 'x', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            }
        },
        error: (err) => {
          this.editTaskForm.enable()
          console.log(err);
  
        Object.keys(this.editTaskForm.controls).forEach(key => {
          this.editTaskForm.get(key)?.setErrors(null);
        });
  
        this._snackBar.open('Something went wrong. Please try again.', 'x', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
          
        }
      })
    }

    ngOnInit(): void {
      this._clientService.getExistingClient().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.client = response
      console.log(this.client, 'res');
      this.cdr.detectChanges()

    })
      this._taskServices.editTaskById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.editTaskForm.patchValue({
          name: response.data.name,
          client_id: response.data.client_id?._id,
          description: response.data.description,
          status: response.data.status
          
        })
        console.log(response, 'res');
        
       
      })
    }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }

}
