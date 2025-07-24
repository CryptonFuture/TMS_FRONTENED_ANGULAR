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
import { EditEmployeeForm } from '../../components/forms/edit-employee-form/edit-employee-form';

@Component({
  selector: 'app-edit-employee-page',
  imports: [EditEmployeeForm, RouterModule, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './edit-employee-page.html',
  styleUrl: './edit-employee-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeePage {
 isDrawerOpen = true;
}
