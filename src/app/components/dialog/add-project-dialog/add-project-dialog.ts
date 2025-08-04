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

@Component({
  selector: 'app-add-project-dialog',
  imports: [MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-project-dialog.html',
  styleUrl: './add-project-dialog.scss',
  providers: [provideNativeDateAdapter()]

})
export class AddProjectDialog implements OnInit, OnDestroy {
  projectForm: FormGroup
  des: any[] = []
  projectStatus: any[] = []
  activeEmployee: any[] = []
  private destroy$ = new Subject<void>();

  constructor(private _projServices: Project, private dialogRef: MatDialogRef<AddProjectDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder) {
    this.projectForm = createProjectForm(this.fb)
  }

  get f() {
    return this.projectForm.controls; 
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }

  ngOnInit(): void {
    this.getDesDepProjectStatus()
  }

  getDesDepProjectStatus(): void {
    forkJoin([
      this._desDep.getDesDep().pipe(retry(3), catchError(err => of(null))),
      this._projServices.projectStatus().pipe(retry(3), catchError(err => of(null))),
      this._empService.getActiveEmp().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      designation,
      projStatus,
      activeEmp
    ]) => {
      this.des = designation.designation
      this.projectStatus = projStatus      
      this.activeEmployee = activeEmp
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSubmit(): void {
    if(this.projectForm.invalid) {
      return
    }
    this.projectForm.disable()
      this._projServices.addProject(this.projectForm.value).subscribe({
        next: (response) => {
          this.projectForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.projectForm.reset()
              Object.keys(this.projectForm.controls).forEach(key => {
                this.projectForm.get(key)?.setErrors(null);
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
          this.projectForm.enable()
          console.log(err);
  
        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectForm.get(key)?.setErrors(null);
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
