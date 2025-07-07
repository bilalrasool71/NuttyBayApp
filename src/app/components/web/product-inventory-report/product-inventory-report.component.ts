import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { UtilsModule } from '../../../core/utilities/utils.module';

@Component({
  selector: 'app-product-inventory-report',
  imports: [UtilsModule],
  templateUrl: './product-inventory-report.component.html',
  styleUrl: './product-inventory-report.component.scss'
})
export class ProductInventoryReportComponent {
 @ViewChild('dt') dt: Table | undefined;
  inventoryData: any[] = [];
  filteredData: any[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);
  globalFilterValue: string = '';

  constructor(
    private salesOrderService: SalesOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadInventoryData(): void {
    this.loading = true;
    this.salesOrderService.getStockReport().subscribe({
      next: (data) => {
        this.inventoryData = data;
        this.filteredData = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading inventory data:', err);
        this.loading = false;
      }
    });
  }

  applyGlobalFilter(): void {
    if (!this.globalFilterValue) {
      this.filteredData = [...this.inventoryData];
      return;
    }

    const searchText = this.globalFilterValue.toLowerCase();
    this.filteredData = this.inventoryData.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key];
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchText);
        }
        return false;
      });
    });
  }

  clearFilters(): void {
    this.globalFilterValue = '';
    this.filteredData = [...this.inventoryData];
  }

  navigateToReport(productId: number, reportType: string): void {
    if (reportType === 'production') {
      this.router.navigate([`/web/product-wise-production-report/${productId}`]);
    } else {
      this.router.navigate([`/web/product-wise-sales-report/${productId}`]);
    }
  }
}
