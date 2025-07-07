import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { RestService } from '../../../services/rest-service/rest.service';
import { DatePipe } from '@angular/common';
import { ProductionRunReportDto } from '../../../core/interfaces/productionRunReportDto';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-production-summary-report',
  imports: [UtilsModule],
  templateUrl: './production-summary-report.component.html',
  styleUrl: './production-summary-report.component.scss',
  providers: [DatePipe]
})
export class ProductionSummaryReportComponent {
  productionData: ProductionRunReportDto[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);
  
  // Date range filter
  startDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  endDate: Date = new Date();
  maxDate: Date = new Date();

  constructor(
    private restService: RestService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadProductionData();
  }

  loadProductionData(): void {
    this.loading = true;
    this.restService.getProductionRunReports(this.startDate, this.endDate)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.productionData = data;
        },
        error: (err) => {
          console.error('Error loading production data:', err);
        }
      });
  }

  onDateChange(): void {
    this.loadProductionData();
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

}
