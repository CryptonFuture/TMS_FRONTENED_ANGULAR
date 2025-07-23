import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Content } from '../../components/content/content';
import { Router, RouterModule } from '@angular/router'
import { User } from '../../services/auth/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Footer, Content, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Dashboard {
  isDrawerOpen = true;

  constructor(private _snackBar: MatSnackBar, private _router: Router, private _userServices: User) {}

  onNavigateDashboard(): void {
    this._router.navigate(['dashboard'])
  }

   onNavigateEmployee(): void {
    this._router.navigate(['employee'])
  }

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
