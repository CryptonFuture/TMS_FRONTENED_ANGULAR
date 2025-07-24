import { ChangeDetectionStrategy, Component } from '@angular/core';
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

@Component({
  selector: 'app-edit-employee-form',
  imports: [MatCheckboxModule, MatSelectModule, MatCardModule, MatIconModule, ReactiveFormsModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './edit-employee-form.html',
  styleUrl: './edit-employee-form.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeeForm {

  editEmployeeForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.editEmployeeForm = updateEmployeeForm(this.fb)
  }

  get f() {
    return this.editEmployeeForm.controls;
  }

}
