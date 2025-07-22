import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';

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

    {
        path: '',
        component: Employee,
        children: [
            {
                path: 'employee',
                loadChildren: () =>
                    import('./pages/employee/employee.routes').then((m) => m.employeeRoutes)
            }
        ]
    }
];
