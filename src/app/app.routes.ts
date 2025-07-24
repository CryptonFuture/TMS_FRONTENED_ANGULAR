import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';
import { AddEmployeeForm } from './components/forms/add-employee-form/add-employee-form';
import { AddEmployeePage } from './pages/add-employee-page/add-employee-page';
import { EditEmployeeForm } from './components/forms/edit-employee-form/edit-employee-form';
import { EditEmployeePage } from './pages/edit-employee-page/edit-employee-page';

export const routes: Routes = [
    {
        path: '',
        component: Login,
        children: [
           {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
           },
           {
                path: 'login',
                loadChildren: () =>
                    import('./pages/auth/login/login.routes').then((m) => m.routes)
           }
        ]
    },

    {
        path: '',
        component: Dashboard,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./pages/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
            }
        ]
    },

    // EMPLOYEE ROUTES

    {
        path: '',
        component: Employee,
        children: [
            {
                path: 'employee',
                loadChildren: () =>
                    import('./pages/employee/employee.routes').then((m) => m.employeeRoutes)
            },

            
        ]
    },

    {
        path: '',
        component: AddEmployeePage,
        children: [
            {
                path: 'add-employee',
                loadChildren: () =>
                    import('./pages/employee/employee.routes').then((m) => m.employeeRoutes)
            },

            
        ]
    },

    {
        path: '',
        component: EditEmployeePage,
        children: [
            {
                path: 'edit-employee',
                loadChildren: () =>
                    import('./pages/employee/employee.routes').then((m) => m.employeeRoutes)
            },

            
        ]
    }
];
