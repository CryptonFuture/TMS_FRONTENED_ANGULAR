import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
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
import { createEmployeeForm } from '../../auth-forms/employee/employee.form';
import { MatSelectModule } from '@angular/material/select';
import { DesDep } from '../../../services/desDep/des-dep';
import { Subject, takeUntil, forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-employee-form',
  imports: [MatSelectModule, CommonModule, MatCardModule, MatIconModule, ReactiveFormsModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './add-employee-form.html',
  styleUrl: './add-employee-form.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export class AddEmployeeForm implements OnInit, OnDestroy {
  value: any;
  employeeForm: FormGroup
  des: any[] = []
  dep: any[] = []
  private destroy$ = new Subject<void>();
  
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private _desDep: DesDep) {
    this.employeeForm = createEmployeeForm(this.fb)
  }

  get f() {
    return this.employeeForm.controls; 
  }

  ngOnInit(): void {
    this.getDesDep()
  }

  getDesDep(): void {
    this._desDep.getDesDep().pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.des = response.designation
      this.dep = response.department  
       this.cdr.detectChanges()   
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }



}
