import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { User } from '../../../services/auth/user';
import { createLoginForm } from '../../../components/auth-forms/sign-in.form';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../../../services/role/role';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [MatProgressSpinnerModule, RouterModule, FormsModule, ReactiveFormsModule, CommonModule, MatTooltipModule, MatMenuModule, MatSidenavModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatGridListModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit, OnDestroy {
  isDrawerOpen = true;
  signInForm: FormGroup
  private destroy$ = new Subject<void>();
  role: any[] = []
  constructor(private _roleServices: Role, private _snackBar: MatSnackBar, private fb: FormBuilder, private _router: Router, private _userServices: User) {
    this.signInForm = createLoginForm(this.fb)
  }

   get f() {
    return this.signInForm.controls;
  }

  ngOnInit(): void {
    this._roleServices.getRoles().pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.role = response
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  submit(): void {
      if (this.signInForm.invalid) {
        return;
      }
      this.signInForm.disable()
      this._userServices.login(this.signInForm.value).subscribe({
        next: (response) => {
          this.signInForm.enable()
          if(response.success) {
            this._snackBar.open(response.message, 'x', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            })
          
            setTimeout(() => {
              this._router.navigateByUrl('dashboard')
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
          this.signInForm.enable()
          console.log(err);
          
        }
      })
    
 
  }
}
