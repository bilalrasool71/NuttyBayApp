import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductStockLevel, BatchStockLevel, StockAdjustmentHistory, StockAdjustmentRequest } from '../../../core/interfaces/stock-adjustment';
import { RestService } from '../../../services/rest-service/rest.service';

@Component({
  selector: 'app-stock-adjustment',
  imports: [UtilsModule],
  templateUrl: './stock-adjustment.component.html',
  styleUrl: './stock-adjustment.component.scss',
  providers: [MessageService]
})
export class StockAdjustmentComponent {
  adjustmentForm: FormGroup;

  // Data
  products: ProductStockLevel[] = [];
  batches: BatchStockLevel[] = [];
  adjustmentHistory: StockAdjustmentHistory[] = [];
  stateOptions: any[] = [{ label: 'One-Way', value: 'one-way' }, { label: 'Return', value: 'return' }];

  // UI State
  showHistory = false;
  isLoading = false;
  historyLoading = false;
  selectedProduct: ProductStockLevel | null = null;
  selectedBatch: BatchStockLevel | null = null;
  adjustmentType: 'units' | 'cartons' = 'units';

  // History filters
  historyProductId: number | null = null;
  historyBatchNo: string | null = null;
  historyDateRange: Date[] | null = null;

  constructor(
    private fb: FormBuilder,
    private stockService: RestService,
    private messageService: MessageService
  ) {
    this.adjustmentForm = this.fb.group({
      productId: [null, Validators.required],
      productionRunProductId: [null, Validators.required],
      unitAdjustment: [0],
      cartonAdjustment: [0],
      reason: ['', Validators.required],
      userId: [3, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.adjustmentForm.get('productId')?.valueChanges.subscribe(productId => {
      this.selectedProduct = this.products.find(p => p.productId === productId) || null;
      this.adjustmentForm.patchValue({ productionRunProductId: null });
      if (this.selectedProduct) {
        this.batches = this.selectedProduct.batches;
      }
    });

    this.adjustmentForm.get('productionRunProductId')?.valueChanges.subscribe(prpId => {
      this.selectedBatch = this.batches.find(b => b.productionRunProductId === prpId) || null;
    });

    // Watch adjustment type changes to reset the other field
    this.adjustmentForm.get('unitAdjustment')?.valueChanges.subscribe(() => {
      if (this.adjustmentType === 'units') {
        this.adjustmentForm.patchValue({ cartonAdjustment: 0 }, { emitEvent: false });
      }
    });

    this.adjustmentForm.get('cartonAdjustment')?.valueChanges.subscribe(() => {
      if (this.adjustmentType === 'cartons') {
        this.adjustmentForm.patchValue({ unitAdjustment: 0 }, { emitEvent: false });
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.stockService.getProductStockLevels().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load products', err);
        this.isLoading = false;
      }
    });
  }

  onAdjustStock(): void {
    if (this.adjustmentForm.invalid || !this.selectedBatch) return;

    this.isLoading = true;
    const formValue = this.adjustmentForm.value;

    // Calculate adjustments based on type
    let unitAdjustment = 0;
    let cartonAdjustment = 0;

    if (this.adjustmentType === 'units') {
      unitAdjustment = formValue.unitAdjustment;
      cartonAdjustment = 0; // Will be calculated on backend
    } else {
      cartonAdjustment = formValue.cartonAdjustment;
      unitAdjustment = 0; // Will be calculated on backend
    }

    const request: StockAdjustmentRequest = {
      ...formValue,
      batchNo: this.selectedBatch.batchNo,
      unitAdjustment: unitAdjustment,
      cartonAdjustment: cartonAdjustment
    };

    this.stockService.adjustStockWithUnitsAndCartons(request).subscribe({
      next: (response) => {
        this.showSuccess(
          'Stock Adjusted Successfully',
          `New quantity: ${response.newUnitQuantity}u (${response.newCartonQuantity}c)`
        );
        this.resetFormAndReload();
      },
      error: (err) => {
        this.showError('Adjustment Failed', err);
        this.isLoading = false;
      }
    });
  }

  resetFormAndReload(): void {
    const currentProductId = this.adjustmentForm.value.productId;
    this.loadProducts();
    this.loadHistory();

    this.adjustmentForm.reset({
      productId: currentProductId,
      userId: 3,
      unitAdjustment: 0,
      cartonAdjustment: 0
    });

    this.isLoading = false;
  }

  loadHistory(): void {
    this.historyLoading = true;

    const productId = this.historyProductId;
    const batchNo = this.historyBatchNo;
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (this.historyDateRange && this.historyDateRange.length === 2) {
      startDate = this.historyDateRange[0];
      endDate = this.historyDateRange[1];
    }

    this.stockService.getAdjustmentHistory(productId, batchNo).subscribe({
      next: (history) => {
        // Filter by date range if specified
        if (startDate && endDate) {
          this.adjustmentHistory = history.filter(item => {
            const itemDate = new Date(item.adjustmentDate);
            return itemDate >= startDate! && itemDate <= endDate!;
          });
        } else {
          this.adjustmentHistory = history;
        }
        this.historyLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load history', err);
        this.historyLoading = false;
      }
    });
  }

  onViewModeChange(): void {
    if (this.showHistory) {
      this.loadHistory();
    }
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