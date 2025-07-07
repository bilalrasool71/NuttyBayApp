import { Component, OnInit, ViewChild } from '@angular/core';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-to-dispatch-orders',
  templateUrl: './pending-to-dispatch-orders.component.html',
  styleUrls: ['./pending-to-dispatch-orders.component.scss'],
  standalone: true,
  imports: [
    UtilsModule, 
  ],
  providers: [DatePipe]
})
export class PendingToDispatchOrdersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  orders: any[] = [];
  filteredOrders: any[] = [];
  loading: boolean = true;
  batches: any[] = [];
  globalFilterValue: string = '';
  skeletonItems = Array(5).fill(0); // For skeleton rows

  constructor(
    private salesOrderService: SalesOrderService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadBatches();
  }

  loadOrders(): void {
    this.loading = true;
    this.salesOrderService.GetPendingSalesOrdersAsync().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false;
      }
    });
  }

  loadBatches(): void {
    this.salesOrderService.getBatches().subscribe({
      next: (data) => this.batches = data,
      error: (err) => console.error('Error loading batches:', err)
    });
  }

  applyGlobalFilter(): void {
    if (!this.globalFilterValue) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const searchText = this.globalFilterValue.toLowerCase();
    this.filteredOrders = this.orders.filter(order => {
      return Object.keys(order).some(key => {
        const value = order[key];
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchText);
        }
        return false;
      });
    });
  }

  clearFilter(): void {
    this.globalFilterValue = '';
    this.filteredOrders = [...this.orders];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  navigateToDispatch(salesOrderId: number) {
    this.router.navigate(['/web/dispatch-order', salesOrderId])
  }
}