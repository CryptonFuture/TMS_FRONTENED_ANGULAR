import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router'
import { User } from '../../services/auth/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-logout',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatSnackBarModule],
  templateUrl: './logout.html',
  styleUrl: './logout.scss'
})
export class Logout {
  constructor(private _snackBar: MatSnackBar, private _router: Router, private _userServices: User) {}

    onUserLoggedOut(): void {
    
    const id: any = localStorage.getItem('id')

    this._userServices.logout(id).subscribe({
      next: (response) => {
       if(response.success) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('id');
            localStorage.removeItem('email');
            localStorage.removeItem('tokenType');

            this._snackBar.open(response.message, 'x', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            })
          
            setTimeout(() => {
              this._router.navigateByUrl('')
            }, 1500)
          } else {
             this._snackBar.open(response.error?.error || 'Login failed. Please try again.', 'x', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        
      },
      error: (error) => {
        console.log(error);
        
      }
    })
  }

}
