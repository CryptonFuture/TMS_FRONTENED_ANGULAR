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
import { Subject, takeUntil } from 'rxjs';
import { DesDep } from '../../../services/desDep/des-dep';
import { User } from '../../../services/auth/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { createTaskForm, updateTaskForm } from '../../auth-forms/task/task.form';
import { Task } from '../../../services/task/task';
import { Client } from '../../../services/client/client';

@Component({
  selector: 'app-add-task-dialog',
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class AddTaskDialog implements OnInit, OnDestroy {
  taskForm: FormGroup
  client: any[] = []
  private destroy$ = new Subject<void>();

  constructor(private _clientService: Client, private _taskServices: Task, private dialogRef: MatDialogRef<AddTaskDialog>, private _snackBar: MatSnackBar, private _userService: User, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder) {
    this.taskForm = createTaskForm(this.fb)
  }

  get f() {
    return this.taskForm.controls; 
  }

   onCancel(): void {
    this.dialogRef.close(false)
  }

  ngOnInit(): void {
    this._clientService.getExistingClient().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.client = response
      console.log(this.client, 'res');
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

   onSubmit(): void {
      if(this.taskForm.invalid) {
        return
      }
      this.taskForm.disable()
      this._taskServices.addTask(this.taskForm.value).subscribe({
        next: (response) => {
          this.taskForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.taskForm.reset()
              Object.keys(this.taskForm.controls).forEach(key => {
                this.taskForm.get(key)?.setErrors(null);
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
          this.taskForm.enable()
          console.log(err);
  
        Object.keys(this.taskForm.controls).forEach(key => {
          this.taskForm.get(key)?.setErrors(null);
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
