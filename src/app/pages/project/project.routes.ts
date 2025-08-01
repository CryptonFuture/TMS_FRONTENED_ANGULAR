import { Routes } from '@angular/router';
import { Project } from './project';
import { AddProjectPage } from '../add-project-page/add-project-page';
import { EditProjectPage } from '../edit-project-page/edit-project-page';

export const projectRoutes: Routes = [
    {
        path: 'project',
        component: Project,
        children: [
           
        ]
    },

    {
        path: 'add-project',
        component: AddProjectPage
    },

    {
        path: 'edit-project/:id',
        component: EditProjectPage
    }

   
];