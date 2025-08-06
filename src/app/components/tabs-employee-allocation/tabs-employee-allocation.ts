import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AssignEmployee } from '../assign-employee/assign-employee';
import { UnassignEmployee } from '../unassign-employee/unassign-employee';

@Component({
  selector: 'app-tabs-employee-allocation',
  imports: [MatTabsModule, AssignEmployee, UnassignEmployee],
  templateUrl: './tabs-employee-allocation.html',
  styleUrl: './tabs-employee-allocation.scss'
})
export class TabsEmployeeAllocation {

}
