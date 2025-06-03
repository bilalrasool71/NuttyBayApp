import { Routes } from '@angular/router';
import { AddSaleOrderComponent } from './components/web/add-sale-order/add-sale-order.component';

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
    },
    {
        path: 'new-sales-order',
        component: AddSaleOrderComponent
    }
];
