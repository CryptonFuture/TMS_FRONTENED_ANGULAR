import { Component, ChangeDetectorRef } from '@angular/core';
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
import { Role } from '../../../services/role/role';

@Component({
  selector: 'app-add-employee-dialog',
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-employee-dialog.html',
  styleUrl: './add-employee-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class AddEmployeeDialog {
  employeeForm: FormGroup
  des: any[] = []
  dep: any[] = []
  role: any[] = []
  private destroy$ = new Subject<void>();

  constructor(private _roleService: Role, private dialogRef: MatDialogRef<AddEmployeeDialog>, private _snackBar: MatSnackBar, private _userService: User, private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empService: Employee, private fb: FormBuilder) {
    this.employeeForm = createEmployeeForm(this.fb)
  }

  get f() {
    return this.employeeForm.controls; 
  }

   ngOnInit(): void {
      this.getDesDep()
      this.getRoles()
    }
  
    getDesDep(): void {
      this._desDep.getDesDep().pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.des = response.designation
        this.dep = response.department  
         this.cdr.detectChanges()   
      })
    }

    getRoles(): void {
      this._roleService.getRoles().pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.role = response
        
        console.log(this.role, 'role');
        
        this.cdr.detectChanges()
      })
    }
  
    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }

     onCancel(): void {
        this.dialogRef.close(false)
      }
  
    onSubmit(): void {
      if(this.employeeForm.invalid) {
        return
      }
      this.employeeForm.disable()
      this._userService.register(this.employeeForm.value).subscribe({
        next: (response) => {
          this.employeeForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.employeeForm.reset()
              Object.keys(this.employeeForm.controls).forEach(key => {
                this.employeeForm.get(key)?.setErrors(null);
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
          this.employeeForm.enable()
          console.log(err);
  
        Object.keys(this.employeeForm.controls).forEach(key => {
          this.employeeForm.get(key)?.setErrors(null);
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
