import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { UtilsModule } from '../../../core/utilities/utils.module';

@Component({
  selector: 'app-reconciliation-report',
  templateUrl: './reconciliation-report.component.html',
  styleUrls: ['./reconciliation-report.component.scss'],
  standalone: true,
  imports: [UtilsModule
  ],
  providers: [DatePipe]
})
export class ReconciliationReportComponent implements OnInit {
 transactions: any[] = [];
  filteredTransactions: any[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);
  globalFilterValue: string = '';

  // Date range
  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    
    const startDate = this.fromDate ? this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') : null;
    const endDate = this.toDate ? this.datePipe.transform(this.toDate, 'yyyy-MM-dd') : null;

    this.salesOrderService.GetReconciliationReport(
      startDate,
      endDate,
      null,
      null
    ).subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.loading = false;
      }
    });
  }

  applyGlobalFilter(): void {
    if (!this.globalFilterValue) {
      this.filteredTransactions = [...this.transactions];
      return;
    }

    const searchText = this.globalFilterValue.toLowerCase();
    this.filteredTransactions = this.transactions.filter(item => {
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
    this.fromDate = null;
    this.toDate = null;
    this.filteredTransactions = [...this.transactions];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }

  getSeverity(transactionType: string): any {
    return transactionType === 'Production' ? 'success' : 'warning';
  }
}