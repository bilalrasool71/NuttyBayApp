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
        path:'pre-making-checklist',
        loadComponent: () => import('./components/pre-making-checklist/pre-making-checklist.component').then(m => m.PreMakingChecklistComponent)
    },
    {
        path: 'making-checklist',
        loadComponent: () => import('./components/making-checklist/making-checklist.component').then(m => m.MakingChecklistComponent)
    },
    {
        path:'pre-packing-checklist',
        loadComponent: () => import('./components/pre-packing-checklist/pre-packing-checklist.component').then(m => m.PrePackingChecklistComponent)
    },
    {
        path: 'packing-checklist',
        loadComponent: () => import('./components/packing-checklist/packing-checklist.component').then(m => m.PackingChecklistComponent),
    },
    {
        path: 'after-login',
        loadComponent: () => import('./components/after-login-page/after-login-page.component').then(m => m.AfterLoginPageComponent),
    }
];
