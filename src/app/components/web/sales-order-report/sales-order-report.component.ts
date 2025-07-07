import { Component, ViewChild } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';

@Component({
  selector: 'app-sales-order-report',
  imports: [UtilsModule],
  providers: [DatePipe],
  templateUrl: './sales-order-report.component.html',
  styleUrl: './sales-order-report.component.scss'
})
export class SalesOrderReportComponent {
 @ViewChild('dt') dt: Table | undefined;
  salesOrders: any[] = [];
  filteredOrders: any[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);
  globalFilterValue: string = '';

  // Date range
  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.loading = true;
    this.salesOrderService.GetSalesOrdersAsync().subscribe({
      next: (orders) => {
        this.salesOrders = orders;
        this.filteredOrders = [...orders];
        console.log(this.salesOrders);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales orders:', err);
        this.loading = false;
      }
    });
  }

  applyGlobalFilter(): void {
    if (!this.globalFilterValue) {
      this.filteredOrders = [...this.salesOrders];
      return;
    }

    const searchText = this.globalFilterValue.toLowerCase();
    this.filteredOrders = this.salesOrders.filter(order => {
      return Object.keys(order).some(key => {
        const value = order[key];
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchText);
        }
        return false;
      });
    });
  }

  clearFilters(): void {
    this.globalFilterValue = '';
    this.fromDate = null;
    this.toDate = null;
    this.filteredOrders = [...this.salesOrders];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  viewOrderDetails(id: number): void {
    this.router.navigate(['/web/sales-order-detials', id]);
  }

  editOrder(salesOrderId: number): void {
    this.router.navigate(['/edit-sales-order', salesOrderId]);
  }

  confirmDelete(salesOrderId: number): void {
    // if (confirm('Are you sure you want to delete this order?')) {
    //   this.salesOrderService.deleteSalesOrder(salesOrderId).subscribe({
    //     next: () => {
    //       alert('Order deleted successfully');
    //       this.loadSalesOrders();
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       alert('Error deleting order');
    //     }
    //   });
    // }
  }
}
