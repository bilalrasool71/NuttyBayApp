import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'param',
        loadComponent: () => import('./components/param-form/param-form.component').then(m => m.ParamFormComponent)
    },
    {
        path: 'making-checklist',
        loadComponent: () => import('./components/making-checklist/making-checklist.component').then(m => m.MakingChecklistComponent)
    }
];
