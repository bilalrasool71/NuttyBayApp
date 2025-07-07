import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { HighchartsChartDirective } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { finalize } from 'rxjs';
import { RestService } from '../../../services/rest-service/rest.service';
import { ProductionRunReportDto } from '../../../core/interfaces/productionRunReportDto';
import { DatePipe } from '@angular/common';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { StockReport } from '../../../core/interfaces/stockReport';
import { ReconciliationReportDto } from '../../../core/interfaces/ReconciliationReport';

@Component({
  selector: 'app-home',
  imports: [UtilsModule, HighchartsChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DatePipe]
})
export class HomeComponent {
  loading: boolean = false;
  productionData: ProductionRunReportDto[] = [];
  startDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  endDate: Date = new Date();
  inventoryData: StockReport[] = [];
  transactions: ReconciliationReportDto[] = []; // Add this property
  fromDate: Date | null = null; // Add this property
  toDate: Date | null = null; // Add this property
  reconciliationChartOptions: Highcharts.Options = {};
  productionChartOptions: Highcharts.Options = {
    series: [
      {
        data: [],
        type: 'pie',
      },
    ],
  };

  inventoryChartOptions: Highcharts.Options = {
    series: [
      {
        data: [],
        type: 'column',
      },
    ],
  };

  maxDate: Date = new Date();

  constructor(private restService: RestService, private salesOrderService: SalesOrderService, private datePipe: DatePipe) {
    this.loadProductionData();
    this.loadInventoryData();
    this.loadTransactions();
  }

  loadProductionData(): void {
    this.loading = true;
    this.restService.getProductionRunReports(this.startDate, this.endDate)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.productionData = data;

          const chartData = this.productionData.map(item => ({
            name: item.productName,
            y: item.totalNumberOfBoxes,
          }));

          this.productionChartOptions = {
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Total Production by Product'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
                }
              }
            },
            series: [
              {
                name: 'Quantity',
                type: 'pie',
                data: chartData
              }
            ]
          };
        },
        error: (err) => {
          console.error('Error loading production data:', err);
        }
      });
  }

  loadInventoryData(): void {
    this.loading = true;
    this.salesOrderService.getStockReport()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.inventoryData = data;

          // Prepare data for inventory chart
          const categories = this.inventoryData.map(item => item.productName);
          const stockInHandData = this.inventoryData.map(item => item.stockInHand);
          const qtyInData = this.inventoryData.map(item => item.qtyIn);
          const qtyOutData = this.inventoryData.map(item => item.qtyOut);

          this.inventoryChartOptions = {
            chart: {
              type: 'column'
            },
            title: {
              text: 'Inventory Overview'
            },
            xAxis: {
              categories: categories,
              crosshair: true
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Quantity'
              }
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0,
                stacking: 'normal'
              }
            },
            series: [
              {
                name: 'Stock In Hand',
                type: 'column',
                data: stockInHandData,
                color: '#7cb5ec'
              },
              {
                name: 'Quantity In',
                type: 'column',
                data: qtyInData,
                color: '#90ed7d'
              },
              {
                name: 'Quantity Out',
                type: 'column',
                data: qtyOutData,
                color: '#f7a35c'
              }
            ]
          };
        },
        error: (err) => {
          console.error('Error loading inventory data:', err);
        }
      });
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
    ).pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.updateReconciliationChart(data);
        },
        error: (err) => {
          console.error('Error loading transactions:', err);
        }
      });
  }

  updateReconciliationChart(data: ReconciliationReportDto[]): void {
    // Group data by product and transaction type
    const productGroups: { [key: string]: any } = {};
    const transactionTypes = new Set<string>();

    data.forEach(item => {
      if (!productGroups[item.productName]) {
        productGroups[item.productName] = {};
      }

      // Group by transaction type
      const type = item.transactionType;
      transactionTypes.add(type);

      if (!productGroups[item.productName][type]) {
        productGroups[item.productName][type] = 0;
      }
      productGroups[item.productName][type] += Math.abs(item.quantity);
    });

    // Prepare series data
    const series: Highcharts.SeriesOptionsType[] = [];
    const categories = Object.keys(productGroups);

    Array.from(transactionTypes).forEach(type => {
      const typeData = categories.map(product => {
        return productGroups[product][type] || 0;
      });

      series.push({
        name: type,
        type: 'column',
        data: typeData
      } as Highcharts.SeriesColumnOptions);
    });

    this.reconciliationChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Transaction Reconciliation'
      },
      xAxis: {
        categories: categories,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Quantity'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: series
    };
  }
}