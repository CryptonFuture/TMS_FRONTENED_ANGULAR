import { Component } from '@angular/core';
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
import { UserLogsList } from '../../components/user-logs-list/user-logs-list';

@Component({
  selector: 'app-user-logs',
  imports: [Logout, UserLogsList, RouterModule, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './user-logs.html',
  styleUrl: './user-logs.scss'
})
export class UserLogs {
  isDrawerOpen = true;
}
