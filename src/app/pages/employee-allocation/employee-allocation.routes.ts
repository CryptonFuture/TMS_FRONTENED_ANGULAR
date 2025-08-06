import { Routes } from '@angular/router';
import { EmployeeAllocation } from './employee-allocation';


export const employeeAllocationRoutes: Routes = [
    {
        path: 'employee-allocation',
        component: EmployeeAllocation,
        children: [
           
        ]
    },

];
