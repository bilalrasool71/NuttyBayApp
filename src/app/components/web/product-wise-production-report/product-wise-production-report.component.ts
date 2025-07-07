import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { DatePipe } from '@angular/common';
import { UtilsModule } from '../../../core/utilities/utils.module';

@Component({
  selector: 'app-product-wise-production-report',
  templateUrl: './product-wise-production-report.component.html',
  styleUrls: ['./product-wise-production-report.component.scss'],
  imports: [UtilsModule],
  providers: [DatePipe]
})
export class ProductWiseProductionReportComponent implements OnInit {
  productId!: number;
  productionData: any[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);

  constructor(
    private route: ActivatedRoute,
    private salesOrderService: SalesOrderService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.params['id'];
    this.loadProductionData();
  }

  loadProductionData(): void {
    this.loading = true;
    this.salesOrderService.getProductWiseProductionReport(this.productId).subscribe({
      next: (data) => {
        this.productionData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading production data:', err);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd MMM yyyy') || '';
  }
  
}