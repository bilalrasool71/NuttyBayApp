import { Routes } from '@angular/router';
import { AddSaleOrderComponent } from './components/web/add-sale-order/add-sale-order.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'landing-page',
        loadComponent: () => import('./components/landing-page/landing-page.component').then(x => x.LandingPageComponent)
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
        path: 'web',
        loadComponent: () => import('./components/web/web-outlet/web-outlet.component').then(x => x.WebOutletComponent),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./components/web/home/home.component').then(x => x.HomeComponent)
            },
            {
                path: 'new-sales-order',
                loadComponent: () => import('./components/web/add-sale-order/add-sale-order.component').then(x => x.AddSaleOrderComponent)
            },
            {
                path: 'pending-dispatch',
                loadComponent: () => import('./components/web/pending-to-dispatch-orders/pending-to-dispatch-orders.component').then(x => x.PendingToDispatchOrdersComponent)
            },
            {
                path: 'sales-order-report',
                loadComponent: () => import('./components/web/sales-order-report/sales-order-report.component').then(x => x.SalesOrderReportComponent)
            },
            {
                path: 'reconciliation-report',
                loadComponent: () => import('./components/web/reconciliation-report/reconciliation-report.component').then(x => x.ReconciliationReportComponent)
            },
            {
                path: 'product-inventory-report',
                loadComponent: () => import('./components/web/product-inventory-report/product-inventory-report.component').then(x => x.ProductInventoryReportComponent)
            },
            {
                path: 'dispatch-order/:id',
                loadComponent: () => import('./components/web/dispatch-sales-order/dispatch-sales-order.component').then(x => x.DispatchSalesOrderComponent)
            },
            {
                path: 'sales-order-detials/:id',
                loadComponent: () => import('./components/web/sales-order-details/sales-order-details.component').then(x => x.SalesOrderDetailsComponent)
            },
            {
                path: 'product-wise-production-report/:id',
                loadComponent: () => import('./components/web/product-wise-production-report/product-wise-production-report.component').then(x => x.ProductWiseProductionReportComponent)
            },
            {
                path: 'product-wise-sales-report/:id',
                loadComponent: () => import('./components/web/product-wise-sales-report/product-wise-sales-report.component').then(x => x.ProductWiseSalesReportComponent)
            },
            {
                path: 'production-summary-report',
                loadComponent: () => import('./components/web/production-summary-report/production-summary-report.component').then(x => x.ProductionSummaryReportComponent)
            },
            {
                path: 'upsert-tiers',
                loadComponent: () => import('./components/web/price-tiers-upsert/price-tiers-upsert.component').then(x => x.PriceTiersUpsertComponent)
            },
            {
                path:'add-new-tier',
                loadComponent: () => import('./components/web/price-tier-add/price-tier-add.component').then(x=>x.PriceTierAddComponent)
            },
            {
                path: 'monthly-sales-report',
                loadComponent: () => import('./components/web/monthly-sales-report/monthly-sales-report.component').then(x=>x.MonthlySalesReportComponent)
            },
            {
                path: 'product-wise-sales-report-monthly',
                loadComponent: () => import('./components/web/product-wise-sales-report-monthly/product-wise-sales-report-monthly.component').then(x=>x.ProductWiseSalesReportMonthlyComponent)
            },
            {
                path: 'stock-adjustment',
                loadComponent: () => import('./components/web/stock-adjustment/stock-adjustment.component').then(x=>x.StockAdjustmentComponent)
            }
        ]
    }
];
