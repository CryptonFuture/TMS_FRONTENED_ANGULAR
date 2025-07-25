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
import { Tabs } from '../../components/tabs/tabs';

@Component({
  selector: 'app-employee',
  imports: [RouterModule, Tabs, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Employee {
 isDrawerOpen = true;

 constructor() {}

}
