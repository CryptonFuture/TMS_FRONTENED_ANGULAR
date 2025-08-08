import { Routes } from '@angular/router';
import { EmployeeAssignment } from './employee-assignment';

export const employeeAssignmentRoutes: Routes = [
    {
        path: 'employee-assignment',
        component: EmployeeAssignment,
        children: [
           
        ]
    },

];
