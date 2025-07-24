import { Routes } from '@angular/router';
import { Employee } from './employee';
import { AddEmployeeForm } from '../../components/forms/add-employee-form/add-employee-form';
import { AddEmployeePage } from '../add-employee-page/add-employee-page';
import { EditEmployeeForm } from '../../components/forms/edit-employee-form/edit-employee-form';
import { EditEmployeePage } from '../edit-employee-page/edit-employee-page';

export const employeeRoutes: Routes = [
    {
        path: 'employee',
        component: Employee,
        children: [
           
        ]
    },

    {
        path: 'add-employee',
        component: AddEmployeePage
    },

    {
        path: 'edit-employee',
        component: EditEmployeePage
    }

   
];
