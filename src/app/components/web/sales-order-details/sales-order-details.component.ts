import { Component } from '@angular/core';
import { SalesOrderLineItemDto, SalesOrderWithHeaderAndItemsDto } from '../../../core/interfaces/SalesorderDto';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';

@Component({
  selector: 'app-sales-order-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
  providers: [DatePipe]
})
export class SalesOrderDetailsComponent {
  orderId!: number;
  orderDetails!: SalesOrderWithHeaderAndItemsDto;
  loading: boolean = true;
  activeTab: string = 'order';

  constructor(
    private route: ActivatedRoute,
    private salesOrderService: SalesOrderService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.params['id'];
    this.loadOrderDetails();
  }
 loadOrderDetails(): void {
    this.loading = true;
    this.salesOrderService.getSalesOrderDetails(this.orderId).subscribe({
      next: (orderDetails) => {
        this.orderDetails = orderDetails;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd MMM yyyy') || '';
  }

  calculateDiscountPrice(item: any): number {
    return item.unitPrice * (1 - (item.discountPercent / 100));
  }
}
