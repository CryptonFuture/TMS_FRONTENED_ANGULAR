import { Routes } from '@angular/router';
import { AddTaskEmployeePage } from '../add-task-employee-page/add-task-employee-page';
import { Task } from './task';

export const taskRoutes: Routes = [
    {
        path: 'task',
        component: Task
    },

    {
        path: 'add-task-employee',
        component: AddTaskEmployeePage
    },
]