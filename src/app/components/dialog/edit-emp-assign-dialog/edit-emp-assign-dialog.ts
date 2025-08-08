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
import { Employee } from '../../../services/employee/employee';
import { Project } from '../../../services/project/project';
import { Task } from '../../../services/task/task';
import { updateEmpAssignForm } from '../../auth-forms/employee-assignment/emp.assign.form';
import { EmpAssign } from '../../../services/emp-assign/emp-assign';

@Component({
  selector: 'app-edit-emp-assign-dialog',
  imports: [MatFormField, MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-emp-assign-dialog.html',
  styleUrl: './edit-emp-assign-dialog.scss',
  providers: [provideNativeDateAdapter()]

})
export class EditEmpAssignDialog {
    editEmpAssignFormForm: FormGroup
    activeEmp: any[] = []
    activeProj: any[] = []
    task: any[] = []
    private destroy$ = new Subject<void>();
  
    constructor(private _empAssignService: EmpAssign, private _empService: Employee, private _projService: Project, private _taskService: Task, private dialogRef: MatDialogRef<EditEmpAssignDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
        this.editEmpAssignFormForm = updateEmpAssignForm(this.fb)
    }
  
    get f() {
      return this.editEmpAssignFormForm.controls; 
    }
  
     onCancel(): void {
      this.dialogRef.close(false)
    }
  
    ngOnInit(): void {
       this._empAssignService.editEmpAssignById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.editEmpAssignFormForm.patchValue({
          user_id: response.data.user_id?._id,
          project_id: response.data.project_id?._id,
          task_id: response.data.task_id?._id,
          plan_hour: response.data.plan_hour,
          working_hours: response.data.working_hours,
          plan_start_date: response.data.plan_start_date,
          plan_end_date: response.data.plan_end_date,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          description: response.data.description,
          status: response.data.status
        })

        console.log(response, 'res');
        this.cdr.detectChanges()
         
      })
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
      if(this.editEmpAssignFormForm.invalid) {
        return
      }

      this.editEmpAssignFormForm.disable()
      this._empAssignService.updateEmpAssign(this.data.data, this.editEmpAssignFormForm.value).subscribe({
        next: (response) => {
          this.editEmpAssignFormForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.editEmpAssignFormForm.reset()
              Object.keys(this.editEmpAssignFormForm.controls).forEach(key => {
                this.editEmpAssignFormForm.get(key)?.setErrors(null);
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
          this.editEmpAssignFormForm.enable()
          console.log(err);
  
        Object.keys(this.editEmpAssignFormForm.controls).forEach(key => {
          this.editEmpAssignFormForm.get(key)?.setErrors(null);
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
  


