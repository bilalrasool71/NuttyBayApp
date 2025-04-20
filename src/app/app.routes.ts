import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'app',
        loadComponent: () => import('./components/view-outlet/view-outlet.component').then(m => m.ViewOutletComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'checklist',
                loadComponent: () => import('./components/checklist-stepper/checklist-stepper.component').then(m => m.ChecklistStepperComponent)
            }
        ]
    }
];
