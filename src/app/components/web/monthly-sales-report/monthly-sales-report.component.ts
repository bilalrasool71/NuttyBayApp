import { Component, ViewChild } from '@angular/core';
import { RestService } from '../../../services/rest-service/rest.service';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { HeaderComponent } from '../header/header.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-monthly-sales-report',
  imports: [UtilsModule, HeaderComponent],
  templateUrl: './monthly-sales-report.component.html',
  styleUrl: './monthly-sales-report.component.scss'
})
export class MonthlySalesReportComponent {
  @ViewChild('dt') dt: Table | undefined;

  orders: any[] = [];
  filteredOrders: any[] = [];
  loading: boolean = false;
  globalFilterValue: string = '';
  selectedMonth: Date = new Date(); // Initialize with current date
  skeletonItems = Array(5).fill(0);
  showDispatchedOnly: boolean = false;

  constructor(
    private restService: RestService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void { 
    // Load current month's data on component initialization
    this.loadOrders();
  }

  loadOrders(): void {
    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth() + 1;

    this.loading = true;
    this.restService.getMonthlySalesOrders(year, month).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dispatched orders:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // First apply dispatched filter if enabled
    let filtered = [...this.orders];
    if (this.showDispatchedOnly) {
      filtered = filtered.filter(order => order.dispatchedDate !== null);
    }

    // Then apply global filter if any
    if (this.globalFilterValue) {
      const searchText = this.globalFilterValue.toLowerCase();
      filtered = filtered.filter(order => {
        return Object.keys(order).some(key => {
          const value = order[key];
          if (value !== null && value !== undefined) {
            return value.toString().toLowerCase().includes(searchText);
          }
          return false;
        });
      });
    }

    this.filteredOrders = filtered;
  }

  toggleDispatchedOnly(): void {
    this.applyFilters();
  }

  clearFilter(): void {
    this.globalFilterValue = '';
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  navigateToDispatch(salesOrderId: number) {
    this.router.navigate(['/web/dispatch-order', salesOrderId]);
  }
}