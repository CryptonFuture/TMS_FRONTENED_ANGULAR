import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../services/employee/employee';
import { CommonModule } from '@angular/common'
import { AssignEmpToClientService } from '../../../services/assignEmpToClient/assign-emp-to-client-service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createAssignEmpToClientForm } from '../../auth-forms/assign-emp-to-client/assign-emp-to-client.form';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-emp-to-client',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatSelectModule, MatDialogModule, MatIconModule],
  templateUrl: './assign-emp-to-client.html',
  styleUrl: './assign-emp-to-client.scss'
})
export class AssignEmpToClient implements OnInit {
  assignEmp: any[] = []
  assignEmpToClientForm: FormGroup

  constructor(private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar, private _assignEmpToClientService: AssignEmpToClientService, private fb: FormBuilder, private _empServices: Employee, private dialogRef: MatDialogRef<AssignEmpToClient>) {
    this.assignEmpToClientForm = createAssignEmpToClientForm(this.fb)
  }

  get f() {
    return this.assignEmpToClientForm.controls; 
  }

   
  onCancel(): void {
    this.dialogRef.close(false)
  }

  ngOnInit(): void {
    this._empServices.getActiveEmp().subscribe((response) => {
      this.assignEmp = response
        console.log(this.assignEmp, 'this.assignEmp');
        this.cdr.detectChanges()
    })
  }

  onSubmit(): void {
      if(this.assignEmpToClientForm.invalid) {
        return
      }
      this.assignEmpToClientForm.disable()

    this._assignEmpToClientService.addAssignEmpToClient(this.assignEmpToClientForm.value).subscribe({
       next: (response) => {
        this.assignEmpToClientForm.enable()
         if(response.success) {
            this._snackBar.open(response.message, 'x', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            })
            this.assignEmpToClientForm.reset()
            Object.keys(this.assignEmpToClientForm.controls).forEach(key => {
              this.assignEmpToClientForm.get(key)?.setErrors(null);
            });
            setTimeout(() => {
              // this._router.navigateByUrl('employee')
              this.dialogRef.close()
            }, 1500)
          } else {
            this.assignEmpToClientForm.enable()
             this._snackBar.open(response.error?.error || 'Login failed. Please try again.', 'x', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
      },
      error: (err) => {
        this.assignEmpToClientForm.enable()
        console.log(err);

      Object.keys(this.assignEmpToClientForm.controls).forEach(key => {
        this.assignEmpToClientForm.get(key)?.setErrors(null);
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
