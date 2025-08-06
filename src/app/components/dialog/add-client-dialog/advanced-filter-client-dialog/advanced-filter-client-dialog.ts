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
import { advanceFilterClientForm } from '../../../auth-forms/client/client.form'


@Component({
  selector: 'app-advanced-filter-client-dialog',
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatDatepickerModule, MatTimepickerModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './advanced-filter-client-dialog.html',
  styleUrl: './advanced-filter-client-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class AdvancedFilterClientDialog {
   clientAdvancedForm: FormGroup
    constructor( private dialogRef: MatDialogRef<AdvancedFilterClientDialog>, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private fb: FormBuilder) {
      this.clientAdvancedForm = advanceFilterClientForm(this.fb)
    }
  
     get f() {
      return this.clientAdvancedForm.controls; 
    }
  
    onCancel(): void {
      this.dialogRef.close(false)
    }
  
    clearFilter(): void {
      this.clientAdvancedForm.reset()
    }
  
    onApplyFilter(): void {
      const fiterValue = this.clientAdvancedForm.value
      console.log(fiterValue);
      
      const description = fiterValue.description || '';
    
      this.dialogRef.close({ description });
    }
}
