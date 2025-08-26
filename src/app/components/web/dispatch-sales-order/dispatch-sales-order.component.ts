import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { SalesOrderHeaderDto } from '../../../core/interfaces/SalesorderDto';

interface BatchSelection {
  batchNo: any;
  dispatchQty: number;
  availableQty?: number;
}

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
        this.orderDetails = orderDetails.header;
        this.lineItems = orderDetails.lineItems.map(item => ({
          ...item,
          orderQty: item.quantity,
          batchSelections: [this.createEmptyBatchSelection()],
          availableBatches: item.availableBatches.filter(x => x.availableQuantity > 0),
          quantityError: null
        }));
        this.checkDispatchAbility();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.loading = false;
      }
    });
  }

  createEmptyBatchSelection(): BatchSelection {
    return { batchNo: null, dispatchQty: 0 };
  }
  addBatchSelection(item: any): void {
    if (this.getItemDispatchedQty(item) >= item.orderQty) {
      return;
    }
    item.batchSelections.push(this.createEmptyBatchSelection());
    this.checkDispatchAbility();
  }

  removeBatchSelection(item: any, index: number): void {
    item.batchSelections.splice(index, 1);
    this.checkDispatchAbility();
  }

  onBatchSelect(item: any, index: number): void {
    const selection = item.batchSelections[index];
    if (selection.batchNo) {
      // Update available quantity for this batch
      selection.availableQty = this.getAvailableQtyForBatch(item, selection.batchNo.batchNo);

      // Set initial dispatch quantity to minimum of available or remaining order quantity
      const remainingQty = item.orderQty - this.getItemDispatchedQty(item) + (selection.dispatchQty || 0);
      selection.dispatchQty = Math.min(selection.availableQty, remainingQty);

      // Force change detection to update the UI
      this.checkDispatchAbility();
    } else {
      selection.dispatchQty = 0;
    }
  }

  getAvailableQtyForBatch(item: any, batchNo: string): number {
    const batch = item.availableBatches.find(b => b.batchNo === batchNo);
    return batch ? batch.availableQuantity : 0;
  }

  getMaxBatchQty(item: any, index: number): number {
    const selection = item.batchSelections[index];
    if (!selection?.batchNo) return 0;

    const availableQty = this.getAvailableQtyForBatch(item, selection.batchNo.batchNo);
    const remainingQty = item.orderQty - this.getItemDispatchedQty(item) + (selection.dispatchQty || 0);

    return Math.min(availableQty, remainingQty);
  }

  getItemDispatchedQty(item: any): number {
    return item.batchSelections
      .filter(b => b.batchNo)
      .reduce((sum, batch) => sum + (batch.dispatchQty || 0), 0);
  }

  getTotalOrderQty(): number {
    return this.lineItems.reduce((sum, item) => sum + item.orderQty, 0);
  }

  getTotalDispatchedQty(): number {
    return this.lineItems.reduce((sum, item) => sum + this.getItemDispatchedQty(item), 0);
  }

  getRemainingQty(): number {
    return this.getTotalOrderQty() - this.getTotalDispatchedQty();
  }
  shouldShowAddBatchButton(item: any): boolean {
    // Don't show if already fully dispatched
    if (this.getItemDispatchedQty(item) >= item.orderQty) {
      return false;
    }

    const hasUnselectedBatch = item.batchSelections.length === 1 && !item.batchSelections[0].batchNo;
    const allBatchesSelected = item.batchSelections.length > 0 && item.batchSelections.every(b => b.batchNo);
    const hasAvailableBatches = item.availableBatches.length > item.batchSelections.length;

    return (hasUnselectedBatch || allBatchesSelected) && hasAvailableBatches;
  }

  validateItem(item: any): boolean {
    const dispatchedQty = this.getItemDispatchedQty(item);

    // Check for duplicate batches
    const batchNumbers = item.batchSelections
      .filter(b => b.batchNo)
      .map(b => b.batchNo.batchNo);

    const hasDuplicates = new Set(batchNumbers).size !== batchNumbers.length;

    if (hasDuplicates) {
      item.quantityError = 'Cannot select the same batch multiple times';
      return false;
    }

    // Check if dispatched quantity exceeds order quantity
    if (dispatchedQty > item.orderQty) {
      item.quantityError = `Total dispatched (${dispatchedQty}) exceeds ordered (${item.orderQty})`;
      return false;
    }

    // Check individual batch quantities
    for (const batch of item.batchSelections) {
      if (batch.batchNo && batch.dispatchQty > this.getAvailableQtyForBatch(item, batch.batchNo.batchNo)) {
        item.quantityError = `Dispatch qty exceeds available for batch ${batch.batchNo.batchNo}`;
        return false;
      }
      // Clear batch if quantity is zero
      if (batch.batchNo && batch.dispatchQty === 0) {
        batch.batchNo = null;
      }
    }

    item.quantityError = null;
    return true;
  }

  checkDispatchAbility(): void {
    let allValid = true;

    // Validate each item
    this.lineItems.forEach(item => {
      if (!this.validateItem(item)) {
        allValid = false;
      }
    });

    // Check if all items have at least one batch selected (but allow zero quantity)
    const allHaveBatches = this.lineItems.every(item =>
      item.batchSelections.some(b => b.batchNo !== null) ||
      item.availableBatches.length === 0
    );

    // Check if dispatched quantity is <= order quantity for all items
    const quantitiesValid = this.lineItems.every(item =>
      this.getItemDispatchedQty(item) <= item.orderQty
    );

    this.canDispatch = allValid && allHaveBatches && quantitiesValid;
  }

  confirmDispatch(): void {
    // Prepare dispatch data matching backend model
    const dispatchData = {
      productTotal: this.calculateProductTotal(),
      grandTotal: this.calculateGrandTotal(),
      lineItems: this.prepareLineItems()
    };

    console.log('Dispatching:', JSON.stringify(dispatchData, null, 2)); // Debug log

    this.loading = true;
    this.salesOrderService.updateDispatchDetails(this.orderId, dispatchData).subscribe({
      next: () => this.handleDispatchSuccess(),
      error: (err) => this.handleDispatchError(err)
    });
  }

  private prepareLineItems(): any[] {
    return this.lineItems
      .filter(item => item.batchSelections?.some(b => b.batchNo))
      .map(item => ({
        orderItemId: item.orderItemId,
        productId: item.productId,
        batches: item.batchSelections
          .filter(b => b.batchNo)
          .map(batch => ({
            batchNo: batch.batchNo.batchNo,
            quantity: +batch.dispatchQty, // Ensure number type
            uomQtyOrdered: +(batch.dispatchQty / item.unit).toFixed(2), // Convert to decimal
            unitPrice: +item.unitPrice // Ensure number type
          })),
        unit: item.unit
      }));
  }
  cancel(): void {
    this.router.navigate(['/web/pending-dispatch']);
  }

  private calculateProductTotal(): number {
    return +this.lineItems.reduce((sum, item) =>
      sum + item.batchSelections
        .filter(b => b.batchNo)
        .reduce((itemSum, batch) =>
          itemSum + (item.unitPrice * batch.dispatchQty), 0), 0)
      .toFixed(2);
  }

  private calculateGrandTotal(): number {
    const productTotal = this.calculateProductTotal();
    return +(productTotal + (productTotal * (this.orderDetails.taxRate / 100))).toFixed(2);
  }

   private handleDispatchSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order dispatched successfully'
    });
    setTimeout(() => {
      this.router.navigate(['/web/pending-dispatch']);
    }, 1000);
    this.loading = false;
  }

  private handleDispatchError(error: any): void {
    console.error('Error dispatching order:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Dispatch Failed',
      detail: error.message || 'Failed to dispatch order'
    });
    this.loading = false;
  }
  
  getAvailableBatchesForSelection(item: any, currentIndex: number): any[] {
    return item.availableBatches.filter(batch => {
      // Check if this batch is not selected in any other selection
      return !item.batchSelections.some((selection, index) =>
        index !== currentIndex &&
        selection.batchNo &&
        selection.batchNo.batchNo === batch.batchNo
      );
    });
  }
}