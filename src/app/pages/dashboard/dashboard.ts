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

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Footer, Content, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Dashboard {
  isDrawerOpen = true;

  constructor(private _router: Router) {}

  onNavigateDashboard(): void {
    this._router.navigate(['dashboard'])
  }

   onNavigateEmployee(): void {
    this._router.navigate(['employee'])
  }
}
