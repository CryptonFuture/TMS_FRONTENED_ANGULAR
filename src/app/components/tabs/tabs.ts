import { Component } from '@angular/core';
import { ActiveEmployee } from '../active-employee/active-employee';
import { MatTabsModule } from '@angular/material/tabs';
import { InactiveEmployee } from '../inactive-employee/inactive-employee';

@Component({
  selector: 'app-tabs',
  imports: [ActiveEmployee, MatTabsModule, InactiveEmployee],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
export class Tabs  {

}
