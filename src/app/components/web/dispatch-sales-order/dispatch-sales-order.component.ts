import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { SalesOrderHeaderDto } from '../../../core/interfaces/SalesorderDto';

@Component({
  selector: 'app-dispatch-sales-order',
  standalone: true,
  imports: [CommonModule, UtilsModule],
  templateUrl: './dispatch-sales-order.component.html',
  styleUrls: ['./dispatch-sales-order.component.scss'],
  providers: [MessageService]
})
export class DispatchSalesOrderComponent implements OnInit {
  orderDetails: SalesOrderHeaderDto;
  orderId: number;
  lineItems: any[] = [];
  loading = false;
  canDispatch = false;
  hasQuantityIssues = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id');
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.salesOrderService.getSalesOrderDetails(this.orderId).subscribe({
      next: (orderDetails) => {
        this.orderDetails = orderDetails.header
        this.lineItems = orderDetails.lineItems.map(item => ({
          ...item,
          selectedBatch: null,
          quantityError: false,
          availableBatches: item.availableBatches.filter(x => x.availableQuantity > 0)
        }));
        console.log(orderDetails)
        this.checkDispatchAbility();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.loading = false;
      }
    });
  }

  onBatchSelect(item: any): void {
    if (item.selectedBatch && item.quantity > item.selectedBatch.availableQuantity) {
      item.quantityError = true;
      this.messageService.add({
        severity: 'warn',
        summary: 'Quantity Warning',
        detail: `Quantity (${item.quantity}) exceeds available batch quantity (${item.selectedBatch.availableQuantity}) for ${item.productName}`,
        life: 5000
      });
    } else {
      item.quantityError = false;
    }
    this.checkDispatchAbility();
  }

  checkDispatchAbility(): void {
    this.hasQuantityIssues = this.lineItems.some(item =>
      item.selectedBatch && item.quantity > item.selectedBatch.availableQuantity
    );

    const allBatchesSelected = this.lineItems.every(item =>
      item.availableBatches.length === 0 || !!item.selectedBatch
    );

    this.canDispatch = allBatchesSelected && !this.hasQuantityIssues;
  }

  confirmDispatch(): void {
    // Reset all quantity errors first
    this.lineItems.forEach(item => item.quantityError = false);

    // Validate all line items before proceeding
    let isValid = true;
    const errorMessages: string[] = [];

    this.lineItems.forEach(item => {
      // Check if batch selection is required and missing
      if (item.availableBatches.length > 0 && !item.selectedBatch) {
        isValid = false;
        errorMessages.push(`Please select a batch for ${item.productName}`);
      }

      // Check if quantity exceeds available
      if (item.selectedBatch && item.quantity > item.selectedBatch.availableQuantity) {
        item.quantityError = true;
        isValid = false;
        errorMessages.push(
          `Quantity (${item.quantity}) exceeds available (${item.selectedBatch.availableQuantity}) for ${item.productName}`
        );
      }
    });

    if (!isValid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot Dispatch Order',
        detail: errorMessages.join('; ')
      });
      return;
    }

    // Calculate all required values
    const lineItemsWithCalculations = this.lineItems
      .filter(item => item.selectedBatch) // Only include items with selected batches
      .map(item => {
        // Calculate uomQtyOrdered (quantity / unit) with 2 decimal places
        const uomQtyOrdered = parseFloat((item.quantity / item.unit).toFixed(2));

        return {
          orderItemId: item.orderItemId,
          productId: item.productId,
          batchNo: item.selectedBatch.batchNo,
          quantity: item.quantity,
          uomQtyOrdered: uomQtyOrdered,
          unitPrice: item.unitPrice,
          unit: item.unit
        };
      });

    // Calculate productTotal (sum of all extendedPrices)
    const productTotal = parseFloat(lineItemsWithCalculations
      .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
      .toFixed(2));

    // Calculate grandTotal (productTotal + (productTotal * taxRate))
    const grandTotal = parseFloat((
      productTotal + (productTotal * (this.orderDetails.taxRate / 100))
    ).toFixed(2));

    // Prepare dispatch data
    const dispatchData = {
      dispatchDate: new Date(),
      productTotal: productTotal,
      grandTotal: grandTotal,
      lineItems: lineItemsWithCalculations
    };

    // Check if we have any items to dispatch
    if (dispatchData.lineItems.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'No Valid Items',
        detail: 'There are no items with valid batches selected for dispatch'
      });
      return;
    }

    this.loading = true;
    this.salesOrderService.updateDispatchDetails(this.orderId, dispatchData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order dispatched successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/web/pending-dispatch']);
        }, 1000);
      },
      error: (err) => {
        console.error('Error dispatching order:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Dispatch Failed',
          detail: err.error?.message || 'Failed to dispatch order'
        });
        this.loading = false;
      }
    });
  }


  cancel(): void {
    this.router.navigate(['/web/pending-dispatch']);
  }
}
