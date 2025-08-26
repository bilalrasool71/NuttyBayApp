import { Component, OnInit } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { HeaderComponent } from '../header/header.component';
import { ProductStockLevel, BatchStockLevel } from '../../../core/interfaces/stock-adjustment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RestService } from '../../../services/rest-service/rest.service';
import { SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-batch-holding',
  imports: [UtilsModule, HeaderComponent],
  templateUrl: './batch-holding.component.html',
  styleUrl: './batch-holding.component.scss'
})
export class BatchHoldingComponent implements OnInit {
  products: ProductStockLevel[] = [];
  batches: BatchStockLevel[] = [];
  activeHolds: any[] = [];
  selectedProduct: ProductStockLevel | null = null;
  selectedBatch: BatchStockLevel | null = null;
  isLoading: boolean = true;
  holdForm: FormGroup;
  adjustmentType: 'units' | 'cartons' = 'units';
  showHoldForm: boolean = false;

  constructor(
    private stockService: RestService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.holdForm = this.fb.group({
      quantity: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      userId: [3, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.stockService.getProductStockLevels().subscribe({
      next: (products) => {
        this.products = products.filter(x => x.totalUnits > 0);
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load products', err);
        this.isLoading = false;
      }
    });
  }

  onProductChange(event: SelectChangeEvent) {
    const value = event.value;
    this.selectedProduct = this.products.find(x => x.productId == value) || null;
    this.selectedBatch = null;
    this.batches = this.selectedProduct?.batches.filter(x => x.unitQuantity > 0) || [];
    this.showHoldForm = false;

    if (this.selectedProduct) {
      this.loadActiveHolds(this.selectedProduct.productId);
    }
  }

  onBatchChange(event: SelectChangeEvent) {
    const value = event.value;
    this.selectedBatch = this.batches.find(x => x.productionRunProductId == value) || null;
    this.showHoldForm = !!this.selectedBatch;
    this.holdForm.reset({
      quantity: 0,
      reason: '',
      userId: 3
    });
  }

  loadActiveHolds(productId: number): void {
    this.stockService.GetActiveHoldsBatch(productId).subscribe({
      next: (holds) => {
        this.activeHolds = holds;
      },
      error: (err) => {
        this.showError('Failed to load active holds', err);
      }
    });
  }

  // onHoldSubmit(): void {
  //   if (!this.selectedBatch || this.holdForm.invalid) return;

  //   const formValue = this.holdForm.value;
  //   const maxQuantity = this.adjustmentType === 'units'
  //     ? this.selectedBatch.unitQuantity
  //     : this.selectedBatch.cartonQuantity;

  //   if (formValue.quantity > maxQuantity) {
  //     this.showError('Invalid Quantity', `Cannot hold more than available. Available: ${maxQuantity}`);
  //     return;
  //   }

  //   const request = {
  //     productId: this.selectedProduct!.productId,
  //     productionRunProductId: this.selectedBatch.productionRunProductId,
  //     batchNo: this.selectedBatch.batchNo,
  //     quantity: this.adjustmentType === 'units' ? formValue.quantity : 0,
  //     cartonQuantity: this.adjustmentType === 'cartons' ? formValue.quantity : 0,
  //     reason: formValue.reason,
  //     userId: formValue.userId,
  //     isUnitHold: this.adjustmentType === 'units'
  //   };

  //   this.isLoading = true;
  //   this.stockService.HoldBatch(request).subscribe({
  //     next: (hold) => {
  //       this.showSuccess('Batch Held Successfully', `${hold.quantity} units held for batch ${hold.batchNo}`);
  //       this.loadProducts(); // Refresh stock levels
  //       this.loadActiveHolds(this.selectedProduct!.productId);
  //       this.showHoldForm = false;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.showError('Hold Failed', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // batch-holding.component.ts
onHoldSubmit(): void {
    if (!this.selectedBatch || this.holdForm.invalid) {
        this.showError('Validation Error', 'Please fill all required fields');
        return;
    }

    const formValue = this.holdForm.value;
    const unitsPerCarton = this.selectedBatch.unitsPerCarton;
    let quantity = 0;
    let cartonQuantity = 0;

    if (this.adjustmentType === 'units') {
        quantity = formValue.quantity;
        // Calculate carton quantity with 2 decimal places
        cartonQuantity = parseFloat((quantity / unitsPerCarton).toFixed(2));
    } else {
        cartonQuantity = formValue.quantity;
        // Calculate unit quantity (whole number)
        quantity = Math.round(cartonQuantity * unitsPerCarton);
    }

    // Validate against available stock
    if (this.adjustmentType === 'units' && quantity > this.selectedBatch.unitQuantity) {
        this.showError('Invalid Quantity', `Cannot hold more units than available. Available: ${this.selectedBatch.unitQuantity}`);
        return;
    }

    if (this.adjustmentType === 'cartons' && cartonQuantity > this.selectedBatch.cartonQuantity) {
        this.showError('Invalid Quantity', `Cannot hold more cartons than available. Available: ${this.selectedBatch.cartonQuantity}`);
        return;
    }

    const request = {
        productId: this.selectedProduct!.productId,
        productionRunProductId: this.selectedBatch.productionRunProductId,
        batchNo: this.selectedBatch.batchNo,
        quantity: quantity,
        cartonQuantity: cartonQuantity,
        reason: formValue.reason,
        userId: formValue.userId,
        isUnitHold: this.adjustmentType === 'units'
    };

    this.isLoading = true;
    this.stockService.HoldBatch(request).subscribe({
        next: (hold) => {
            this.showSuccess('Batch Held Successfully', 
                `${hold.quantity} units (${hold.cartonQuantity} cartons) held for batch ${hold.batchNo}`);
            this.loadProducts();
            this.loadActiveHolds(this.selectedProduct!.productId);
            this.showHoldForm = false;
            this.isLoading = false;
        },
        error: (err) => {
            this.showError('Hold Failed', err);
            this.isLoading = false;
        }
    });
}
  onUnhold(holdId: number): void {
    this.isLoading = true;
    this.stockService.UnHoldBatch(holdId).subscribe({
      next: () => {
        this.showSuccess('Batch Unheld Successfully', 'The held quantity has been released');
        this.loadProducts(); // Refresh stock levels
        this.loadActiveHolds(this.selectedProduct!.productId);
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Unhold Failed', err);
        this.isLoading = false;
      }
    });
  }

  showSuccess(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 5000
    });
  }

  showError(summary: string, error: any): void {
    const detail = error.error?.message || error.message || 'An unknown error occurred';
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 10000
    });
  }
}
