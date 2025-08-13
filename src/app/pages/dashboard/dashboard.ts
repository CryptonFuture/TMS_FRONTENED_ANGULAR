import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Logout } from '../../components/logout/logout';
import { Route } from '../../services/route/route';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Logout, Footer, Content, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Dashboard implements OnInit, OnDestroy {
  isDrawerOpen = true;
  name: any
  currentUserRole: any = 0
  routes: any[] = []
  private destroy$ = new Subject<void>();
  
  constructor(private cdr: ChangeDetectorRef, private _route: Route, private _snackBar: MatSnackBar, private _router: Router, private _userServices: User) {}

  ngOnInit(): void {
    const username = localStorage.getItem('name')
    this.name = username    

    const role = JSON.parse(localStorage.getItem('role') || '{}')
    this.currentUserRole = role

    this.getRoutes()

  }

  getRoutes(): void {
    this._route.getRoute().pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.routes = response
      console.log(this.routes, 'routes');
      
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


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
