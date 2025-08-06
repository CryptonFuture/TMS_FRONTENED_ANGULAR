import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterModule } from '@angular/router'
import { Logout } from '../../components/logout/logout';
import { TabsEmployeeAllocation } from '../../components/tabs-employee-allocation/tabs-employee-allocation';

@Component({
  selector: 'app-employee-allocation',
  imports: [TabsEmployeeAllocation, Logout, RouterModule, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './employee-allocation.html',
  styleUrl: './employee-allocation.scss'
})
export class EmployeeAllocation {
   isDrawerOpen = true;

}
