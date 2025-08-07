import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../../services/employee/employee';
import { CommonModule } from '@angular/common'
import { AssignEmpToClientService } from '../../../services/assignEmpToClient/assign-emp-to-client-service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createAssignEmpToClientForm, editAssignEmpToClientForm } from '../../auth-forms/assign-emp-to-client/assign-emp-to-client.form';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Project } from '../../../services/project/project';
import { Client } from '../../../services/client/client';
import { catchError, forkJoin, of, retry, Subject, takeUntil } from 'rxjs';
import { EmpAlloc } from '../../../services/emp-alloc/emp-alloc';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-assign-emp-to-client',
  imports: [MatCheckboxModule, MatInputModule, MatFormField, MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatSelectModule, MatDialogModule, MatIconModule],
  templateUrl: './edit-assign-emp-to-client.html',
  styleUrl: './edit-assign-emp-to-client.scss'
})
export class EditAssignEmpToClient implements OnInit, OnDestroy {
   assignEmp: any[] = []
   project: any[] = []
   existingClient: any[] = []
   editAssignEmpToClientForm: FormGroup
   private destroy$ = new Subject<void>();

  constructor(private _empServices: Employee, private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar,private _clientService: Client, private _projService: Project,@Inject(MAT_DIALOG_DATA) public data: {data: any}, private dialogRef: MatDialogRef<EditAssignEmpToClient>, private _empAllocServices: EmpAlloc, private fb: FormBuilder) {
    this.editAssignEmpToClientForm = editAssignEmpToClientForm(this.fb)
  }

   get f() {
    return this.editAssignEmpToClientForm.controls; 
  }

   
  onCancel(): void {
    this.dialogRef.close(false)
  }


  ngOnInit(): void {
      this._empAllocServices.editAllocEmpById(this.data.data).pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.editAssignEmpToClientForm.patchValue({
          emp_id: response.data.emp_id?._id,
          client_id: response.data.client_id?._id,
          proj_id: response.data.proj_id?._id,
          description: response.data.description
        }) 
      })

      this.getEmpProj()
  }

  getEmpProj(): void {
    forkJoin([
      this._empServices.getActiveEmp().pipe(retry(3), catchError(err => of(null))),
      this._projService.getActiveProject().pipe(retry(3), catchError(err => of(null))),
      this._clientService.getExistingClient().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      assignEmployee,
      proj,
      client
    ]) => {
      this.assignEmp = assignEmployee
      this.project = proj
      this.existingClient = client

      console.log(this.project, 'proj');
      
      this.cdr.detectChanges()
    })
  }

    onSubmit(): void {
      if(this.editAssignEmpToClientForm.invalid) {
        return
      }
      this.editAssignEmpToClientForm.disable()
      this._empAllocServices.updateAllocEmp(this.data.data, this.editAssignEmpToClientForm.value).subscribe({
        next: (response) => {
          this.editAssignEmpToClientForm.enable()
           if(response.success) {
              this._snackBar.open(response.message, 'x', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.editAssignEmpToClientForm.reset()
              Object.keys(this.editAssignEmpToClientForm.controls).forEach(key => {
                this.editAssignEmpToClientForm.get(key)?.setErrors(null);
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
          this.editAssignEmpToClientForm.enable()
          console.log(err);
  
        Object.keys(this.editAssignEmpToClientForm.controls).forEach(key => {
          this.editAssignEmpToClientForm.get(key)?.setErrors(null);
        });
  
        this._snackBar.open('Something went wrong. Please try again.', 'x', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
          
        }
      })
    }

    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }



}
