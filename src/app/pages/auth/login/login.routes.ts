import { Routes } from '@angular/router';
import { Login } from './login';
import { employeeGuard } from '../../../guard/employee/employee-guard';

export const routes: Routes = [
    {
        path: '',
        component: Login,
    }
];
