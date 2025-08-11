import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';
import { AddEmployeeForm } from './components/forms/add-employee-form/add-employee-form';
import { AddEmployeePage } from './pages/add-employee-page/add-employee-page';
import { EditEmployeeForm } from './components/forms/edit-employee-form/edit-employee-form';
import { EditEmployeePage } from './pages/edit-employee-page/edit-employee-page';
import { employeeGuard } from './guard/employee/employee-guard';
import { Task } from './pages/task/task';
import { Project } from './pages/project/project';
import { Client } from './pages/client/client';
import { EmployeeAllocation } from './pages/employee-allocation/employee-allocation';
import { EmployeeAssignment } from './pages/employee-assignment/employee-assignment';
import { TaskAssignment } from './pages/task-assignment/task-assignment';
import { UserLogs } from './pages/user-logs/user-logs';
import { EndPoint } from './pages/end-point/end-point';

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

    
    // TASK

    {
        path: '',
        component: Task,
        children: [
            {
                path: 'task',
                loadChildren: () =>
                    import('./pages/task/task.routes').then((m) => m.taskRoutes)
            },

            
        ]
    },

    // PROJECT

    {
        path: '',
        component: Project,
        children: [
            {
                path: 'project',
                loadChildren: () =>
                    import('./pages/project/project.routes').then((m) => m.projectRoutes)
            },

            
        ]
    },

    // CLIENT

    {
        path: '',
        component: Client,
        children: [
            {
                path: 'client',
                loadChildren: () =>
                    import('./pages/client/client.routes').then((m) => m.clientRoutes)
            },

            
        ]
    },

     // EMPLOYEE ALLOCATION

    {
        path: '',
        component: EmployeeAllocation,
        children: [
            {
                path: 'employee-allocation',
                loadChildren: () =>
                    import('./pages/employee-allocation/employee-allocation.routes').then((m) => m.employeeAllocationRoutes)
            },

        ]
    },

    // EMPLOYEE ASSIGNMENT

    {
        path: '',
        component: EmployeeAssignment,
        children: [
            {
                path: 'employee-assignment',
                loadChildren: () =>
                    import('./pages/employee-assignment/employee-assignment.routes').then((m) => m.employeeAssignmentRoutes)
            },

        ]
    },

    // TASK ASSIGNMENT

    {
        path: '',
        component: TaskAssignment,
        children: [
            {
                path: 'task-assignment',
                loadChildren: () =>
                    import('./pages/task-assignment/task-assignment.routes').then((m) => m.taskAssignmentRoutes)
            },

        ]
    },

    // USER LOGS

    {
        path: '',
        component: UserLogs,
        children: [
            {
                path: 'user-logs',
                loadChildren: () =>
                    import('./pages/user-logs/user.logs.routes').then((m) => m.logsRoutes)
            },

        ]
    },

     // END POINT

    {
        path: '',
        component: EndPoint,
        children: [
            {
                path: 'end-point',
                loadChildren: () =>
                    import('./pages/end-point/end.point.routes').then((m) => m.endPointRoutes)
            },

        ]
    },
];
