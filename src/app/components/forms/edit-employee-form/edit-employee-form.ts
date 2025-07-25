import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { updateEmployeeForm } from '../../auth-forms/employee/employee.form';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, ActivatedRoute } from '@angular/router'
import { of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Employee } from '../../../services/employee/employee';

@Component({
  selector: 'app-edit-employee-form',
  imports: [MatCheckboxModule, MatSelectModule, MatCardModule, MatIconModule, ReactiveFormsModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-employee-form.html',
  styleUrl: './edit-employee-form.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeeForm implements OnDestroy {

  editEmployeeForm: FormGroup
  private destroy$ = new Subject<void>();
  
  constructor(private _empServices: Employee, private fb: FormBuilder, private _router: Router, private _activeRoute: ActivatedRoute) {
    this.editEmployeeForm = updateEmployeeForm(this.fb)
  }

  ngOnInit(): void {
  // this._activeRoute.paramMap.pipe(
  //   tap(params => {
  //     const id = params.get('id')
  //     console.log(id, 'id');
      
  //   }),
  //   takeUntil(this.destroy$)
  // ).subscribe()

  // if(id) {
  //   this._empServices.editEmpById(id).subscribe(response => {
  //     console.log(response);
  //   })
  // }

  }

  

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  get f() {
    return this.editEmployeeForm.controls;
  }

}
