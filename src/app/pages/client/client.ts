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
import { User } from '../../services/auth/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TabsClient } from '../../components/tabs-client/tabs-client';

@Component({
  selector: 'app-client',
  imports: [TabsClient, RouterModule, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './client.html',
  styleUrl: './client.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Client {
  isDrawerOpen = true;

}
