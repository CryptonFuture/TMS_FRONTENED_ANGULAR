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
import { EmpAssign } from '../../../services/emp-assign/emp-assign';
import { createEmpAssignForm } from '../../auth-forms/employee-assignment/emp.assign.form';
import { Employee } from '../../../services/employee/employee';
import { Project } from '../../../services/project/project';
import { Task } from '../../../services/task/task';

@Component({
  selector: 'app-add-emp-assign-dialog',
  imports: [MatFormField, MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-emp-assign-dialog.html',
  styleUrl: './add-emp-assign-dialog.scss',
  providers: [provideNativeDateAdapter()]

})
export class AddEmpAssignDialog implements OnInit, OnDestroy {

  addEmpAssignFormForm: FormGroup
  activeEmp: any[] = []
  activeProj: any[] = []
  task: any[] = []
  private destroy$ = new Subject<void>();

  constructor(private _empService: Employee, private _projService: Project, private _taskService: Task, private _empAssignService: EmpAssign, private dialogRef: MatDialogRef<AddEmpAssignDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
      this.addEmpAssignFormForm = createEmpAssignForm(this.fb)
  }

  get f() {
    return this.addEmpAssignFormForm.controls; 
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
      if(this.addEmpAssignFormForm.invalid) {
        return
      }
      this.addEmpAssignFormForm.disable()
      this._empAssignService.addEmpAssign(this.addEmpAssignFormForm.value).subscribe({
        next: (response) => {
          this.addEmpAssignFormForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.addEmpAssignFormForm.reset()
              Object.keys(this.addEmpAssignFormForm.controls).forEach(key => {
                this.addEmpAssignFormForm.get(key)?.setErrors(null);
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
          this.addEmpAssignFormForm.enable()
          console.log(err);
  
        Object.keys(this.addEmpAssignFormForm.controls).forEach(key => {
          this.addEmpAssignFormForm.get(key)?.setErrors(null);
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
