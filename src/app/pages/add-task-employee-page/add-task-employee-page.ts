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
import { AddTaskEmployeeForm } from '../../components/forms/add-task-employee-form/add-task-employee-form';

@Component({
  selector: 'app-add-task-employee-page',
  imports: [AddTaskEmployeeForm, RouterModule, Footer, MatGridListModule, MatCardModule, MatSidenavModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './add-task-employee-page.html',
  styleUrl: './add-task-employee-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AddTaskEmployeePage {
  isDrawerOpen = true;
}
