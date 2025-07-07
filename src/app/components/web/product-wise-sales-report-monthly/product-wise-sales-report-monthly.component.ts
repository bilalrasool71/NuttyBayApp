import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { HeaderComponent } from '../header/header.component';
import { RestService } from '../../../services/rest-service/rest.service';

@Component({
  selector: 'app-product-wise-sales-report-monthly',
  imports: [UtilsModule, HeaderComponent],
  templateUrl: './product-wise-sales-report-monthly.component.html',
  styleUrl: './product-wise-sales-report-monthly.component.scss'
})
export class ProductWiseSalesReportMonthlyComponent {
  salesData: any[] = [];
  loading = false;
  selectedMonth: Date = new Date(); // Initialize with current month
  skeletonItems = Array(5).fill(0);
  showDispatchedOnly: boolean = false;

  constructor(private restService: RestService) {}

  ngOnInit(): void {
    this.loadSalesData(); // Load data on init
  }

  loadSalesData(): void {
    if (!this.selectedMonth) return;

    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth() + 1;

    this.loading = true;
    this.restService.getProductWiseSalesReportMonthly(year, month, this.showDispatchedOnly).subscribe({
      next: (data) => {
        this.salesData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales data:', err);
        this.loading = false;
      }
    });
  }

  toggleDispatchedOnly(): void {
    this.loadSalesData(); // Reload data when checkbox changes
  }
}