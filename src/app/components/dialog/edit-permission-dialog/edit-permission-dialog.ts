import { Component, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
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
import { createPermissionForm, updatePermissionForm } from '../../auth-forms/permission/permission.form';
import { Route } from '../../../services/route/route';
import { Role } from '../../../services/role/role';
import { Permission } from '../../../services/permission/permission';

@Component({
  selector: 'app-edit-permission-dialog',
  imports: [MatFormField, MatCheckboxModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-permission-dialog.html',
  styleUrl: './edit-permission-dialog.scss'
})
export class EditPermissionDialog implements OnInit, OnDestroy {
  editPermissionForm: FormGroup
  permission: any[] = []
  role: any[] = []
  actionsList = ['create', 'read', 'update', 'delete'];
  private destroy$ = new Subject<void>();

  constructor(private _permissionService: Permission, private _roleServices: Role, private _routeService: Route, private _empService: Employee, private _projService: Project, private _taskService: Task, private _empAssignService: EmpAssign, private dialogRef: MatDialogRef<EditPermissionDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
      this.editPermissionForm = updatePermissionForm(this.fb)
  }

  get f() {
    return this.editPermissionForm.controls; 
  }

   onCancel(): void {
    this.dialogRef.close(false)
  }

  ngOnInit(): void {

   this.getRouteRole()

    this._permissionService.editPermissionById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe(response => {
         const data = response.data;
      this.editPermissionForm.patchValue({
          name: data.name,
          route: data.route,
          role: data.role,
          description: data.description
        })
        console.log(response, 'res');
        const actionsArray = this.editPermissionForm.get('action') as FormArray;
        actionsArray.clear(); 

        if (Array.isArray(data.action)) {
          data.action.forEach((action: any) => {
            actionsArray.push(this.fb.control(action));
          });
        }
        console.log(this.editPermissionForm.value, 'form with actions');
        this.cdr.detectChanges()
       
      })
  }

  onCheckboxChange(event: any, action: string) {
    const actionsArray = this.editPermissionForm.get('action') as FormArray;

    if (event.checked) {
      actionsArray.push(this.fb.control(action));
    } else {
      const index = actionsArray.controls.findIndex(x => x.value === action);
      actionsArray.removeAt(index);
    }
  }

  getRouteRole(): void {
    forkJoin([
      this._routeService.getRoute().pipe(retry(3) , catchError(err => of(null))),
       this._roleServices.getRoles().pipe(retry(3) , catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      routes,
      roles
    ]) => {
      this.permission = routes
      this.role = roles

      console.log(this.permission, this.role);
      
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

 onSubmit(): void {
      if(this.editPermissionForm.invalid) {
        return
      }
      this.editPermissionForm.disable()
      this._permissionService.updatePermission(this.data.data, this.editPermissionForm.value).subscribe({
        next: (response) => {
          this.editPermissionForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.editPermissionForm.reset()
              Object.keys(this.editPermissionForm.controls).forEach(key => {
                this.editPermissionForm.get(key)?.setErrors(null);
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
          this.editPermissionForm.enable()
          console.log(err);
  
        Object.keys(this.editPermissionForm.controls).forEach(key => {
          this.editPermissionForm.get(key)?.setErrors(null);
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
