import { Component, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { updateEmployeeForm } from '../../auth-forms/employee/employee.form';
import { Employee } from '../../../services/employee/employee';
import { Subject, takeUntil } from 'rxjs';
import { DesDep } from '../../../services/desDep/des-dep';
import { CommonModule } from '@angular/common'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-employee-dialog',
  imports: [CommonModule, MatSnackBarModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-employee-dialog.html',
  styleUrl: './edit-employee-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class EditEmployeeDialog implements OnInit, OnDestroy {
  editEmployeeForm: FormGroup
  private destroy$ = new Subject<void>();
  des: any[] = []
  dep: any[] = []
  constructor(private dialogRef: MatDialogRef<EditEmployeeDialog>, private _snackbar: MatSnackBar,private cdr: ChangeDetectorRef, private _desDep: DesDep, private _empServices: Employee, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {data: any}) {
    this.editEmployeeForm = updateEmployeeForm(this.fb)
  }

  ngOnInit(): void {
    this._empServices.editEmpById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe((response) => {
     console.log(response.data.designation, 'res');
     
      this.editEmployeeForm.patchValue({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
        description: response.data.description,
        joiningDate: response.data.joiningDate,
        designName: response.data.designName,
        department: response.data.department,
        active: response.data.active,
        is_admin: response.data.is_admin
      })

    })

    this.getDesDep()
  }

  getDesDep(): void {
    this._desDep.getDesDep().pipe(takeUntil(this.destroy$)).subscribe(response => {
      console.log(response, 'res');
      this.des = response.designation
      this.dep = response.department  
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

  onUpdate() {
    if(this.editEmployeeForm.invalid) {
      return
    }

    this.editEmployeeForm.disable()
      this._empServices.updateUser(this.data.data, this.editEmployeeForm.value).subscribe({
        next: (response) => {
          this.editEmployeeForm.enable()
           if(response.success) {
              this._snackbar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              Object.keys(this.editEmployeeForm.controls).forEach(key => {
                this.editEmployeeForm.get(key)?.setErrors(null);
              });
              setTimeout(() => {
                this.dialogRef.close()
              }, 1500)
            } else {
               this._snackbar.open(response.error?.error || 'Login failed. Please try again.', 'x', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            }
        },
        error: (err) => {
          this.editEmployeeForm.enable()
          console.log(err);
  
        Object.keys(this.editEmployeeForm.controls).forEach(key => {
          this.editEmployeeForm.get(key)?.setErrors(null);
        });
  
        this._snackbar.open('Something went wrong. Please try again.', 'x', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
          
        }
      })
  }
}
