import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { Logout } from '../../components/logout/logout';

@Component({
  selector: 'app-employee',
  imports: [Logout, RouterModule, Tabs, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Employee implements OnInit {
 isDrawerOpen = true;
 name: any
  currentUserRole: any = 0

 constructor() {}

  ngOnInit(): void {
    const username = localStorage.getItem('name')
    this.name = username  
    
      const role = JSON.parse(localStorage.getItem('role') || '{}')
    this.currentUserRole = role
  }

}
