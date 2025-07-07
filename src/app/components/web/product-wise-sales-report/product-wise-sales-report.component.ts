import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { UtilsModule } from '../../../core/utilities/utils.module';

@Component({
  selector: 'app-product-wise-sales-report',
  imports: [UtilsModule],
  providers: [DatePipe],
  templateUrl: './product-wise-sales-report.component.html',
  styleUrl: './product-wise-sales-report.component.scss'
})
export class ProductWiseSalesReportComponent {
  @ViewChild('dt') dt: Table | undefined;
  productId!: number;
  salesData: any[] = [];
  filteredData: any[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);
  globalFilterValue: string = '';

  constructor(
    private route: ActivatedRoute,
    private salesOrderService: SalesOrderService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.params['id'];
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.loading = true;
    this.salesOrderService.getProductWiseSalesReport(this.productId).subscribe({
      next: (data) => {
        this.salesData = data;
        this.filteredData = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales data:', err);
        this.loading = false;
      }
    });
  }

  applyGlobalFilter(): void {
    if (!this.globalFilterValue) {
      this.filteredData = [...this.salesData];
      return;
    }

    const searchText = this.globalFilterValue.toLowerCase();
    this.filteredData = this.salesData.filter(item => {
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
    this.filteredData = [...this.salesData];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd MMM yyyy') || '';
  }
}
