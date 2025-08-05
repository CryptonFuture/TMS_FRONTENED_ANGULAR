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
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { advanceFilterTaskForm } from '../../../auth-forms/task/task.form';

@Component({
  selector: 'app-advanced-filter-task-dialog',
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './advanced-filter-task-dialog.html',
  styleUrl: './advanced-filter-task-dialog.scss',
  providers: [provideNativeDateAdapter()]

})
export class AdvancedFilterTaskDialog {
  taskAdvancedForm: FormGroup
  constructor( private dialogRef: MatDialogRef<AdvancedFilterTaskDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    this.taskAdvancedForm = advanceFilterTaskForm(this.fb)
  }

   get f() {
    return this.taskAdvancedForm.controls; 
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }

  clearFilter(): void {
    this.taskAdvancedForm.reset()
  }

  onApplyFilter(): void {
    const fiterValue = this.taskAdvancedForm.value
    console.log(fiterValue);
    
    const status = fiterValue.status || '';
  

    this.dialogRef.close({ status });
  }




}
