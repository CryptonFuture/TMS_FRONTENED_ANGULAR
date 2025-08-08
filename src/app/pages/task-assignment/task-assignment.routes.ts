import { Routes } from '@angular/router';
import { TaskAssignment } from './task-assignment';

export const taskAssignmentRoutes: Routes = [
    {
        path: 'task-assignment',
        component: TaskAssignment,
        children: [
           
        ]
    },

];
