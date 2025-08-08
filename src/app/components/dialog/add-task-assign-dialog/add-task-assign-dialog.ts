import { Component, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { catchError, forkJoin, of, retry, Subject, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskAssign } from '../../../services/task-assign/task-assign';
import { Employee } from '../../../services/employee/employee';
import { Project } from '../../../services/project/project';
import { Task } from '../../../services/task/task';
import { createTaskAssignForm } from '../../auth-forms/task-assignment/task.assign.form';

@Component({
  selector: 'app-add-task-assign-dialog',
  imports: [MatFormField, MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-task-assign-dialog.html',
  styleUrl: './add-task-assign-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class AddTaskAssignDialog implements OnInit, OnDestroy {
  addTaskAssignFormForm: FormGroup
  activeEmp: any[] = []
  activeProj: any[] = []
  task: any[] = []
  private destroy$ = new Subject<void>();

  constructor(private _empService: Employee, private _projService: Project, private _taskService: Task, private _taskAssignService: TaskAssign, private dialogRef: MatDialogRef<AddTaskAssignDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
      this.addTaskAssignFormForm = createTaskAssignForm(this.fb)
  }

  get f() {
    return this.addTaskAssignFormForm.controls; 
  }

   onCancel(): void {
    this.dialogRef.close(false)
  }

  ngOnInit(): void {
    this.getEmpProjTask()
  }

  getEmpProjTask(): void {
    forkJoin([
      this._empService.getActiveEmp().pipe(retry(3), catchError(err => of(null))),
      this._projService.getActiveProject().pipe(retry(3), catchError(err => of(null))),
      this._taskService.getTask().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      activeEmployee,
      activeProject,
      tasks
    ]) => {
      this.activeEmp = activeEmployee,
      this.activeProj = activeProject,
      this.task = tasks

      console.log(this.activeEmp, 'activeEmp');
      console.log(this.activeProj, 'activeProj');
      console.log(this.task, 'task');

      this.cdr.detectChanges()

    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

   onSubmit(): void {
      if(this.addTaskAssignFormForm.invalid) {
        return
      }
      this.addTaskAssignFormForm.disable()
      this._taskAssignService.addTaskAssign(this.addTaskAssignFormForm.value).subscribe({
        next: (response) => {
          this.addTaskAssignFormForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.addTaskAssignFormForm.reset()
              Object.keys(this.addTaskAssignFormForm.controls).forEach(key => {
                this.addTaskAssignFormForm.get(key)?.setErrors(null);
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
          this.addTaskAssignFormForm.enable()
          console.log(err);
  
        Object.keys(this.addTaskAssignFormForm.controls).forEach(key => {
          this.addTaskAssignFormForm.get(key)?.setErrors(null);
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
