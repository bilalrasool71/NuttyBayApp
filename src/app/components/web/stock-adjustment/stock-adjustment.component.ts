import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductStockLevel, BatchStockLevel, StockAdjustmentHistory, StockTakeHistory, StockAdjustmentRequest, StockTakeRequest } from '../../../core/interfaces/stock-adjustment';
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
  stockTakeForm: FormGroup;

  // Datat
  products: ProductStockLevel[] = [];
  batches: BatchStockLevel[] = [];
  adjustmentHistory: StockAdjustmentHistory[] = [];
  stockTakeHistory: StockTakeHistory[] = [];

  // UI State
  activeTabIndex = 0;
  isLoading = false;
  historyLoading = false;
  selectedProduct: ProductStockLevel | null = null;
  selectedBatch: BatchStockLevel | null = null;

  constructor(
    private fb: FormBuilder,
    private stockService: RestService,
    private messageService: MessageService
  ) {
    // Initialize forms
    this.adjustmentForm = this.fb.group({
      productId: [null, Validators.required],
      productionRunProductId: [null, Validators.required],
      unitAdjustment: [0, [Validators.required]],
      cartonAdjustment: [0],
      reason: ['', Validators.required],
      userId: [3, Validators.required],
      isStockTake: [false]
    });

    this.stockTakeForm = this.fb.group({
      productId: [null, Validators.required],
      productionRunProductId: [null, Validators.required],
      actualUnits: [0, [Validators.required, Validators.min(0)]],
      actualCartons: [0, [Validators.required, Validators.min(0)]],
      notes: [''],
      userId: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    // Adjustment form listeners
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

    // Stock take form listeners
    this.stockTakeForm.get('productId')?.valueChanges.subscribe(productId => {
      this.selectedProduct = this.products.find(p => p.productId === productId) || null;
      this.stockTakeForm.patchValue({ productionRunProductId: null });
      if (this.selectedProduct) {
        this.batches = this.selectedProduct.batches;
      }
    });

    this.stockTakeForm.get('productionRunProductId')?.valueChanges.subscribe(prpId => {
      this.selectedBatch = this.batches.find(b => b.productionRunProductId === prpId) || null;
      if (this.selectedBatch) {
        this.updateStockTakeFormDefaults();
      }
    });
  }

  updateStockTakeFormDefaults(): void {
    if (!this.selectedBatch) return;

    const unitsPerCarton = this.selectedBatch.unitsPerCarton;
    const systemUnits = this.selectedBatch.unitQuantity;
    const systemCartons = Math.floor(systemUnits / unitsPerCarton);

    this.stockTakeForm.patchValue({
      actualUnits: systemUnits % unitsPerCarton,
      actualCartons: systemCartons
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
    const request: StockAdjustmentRequest = {
      ...this.adjustmentForm.value,
      batchNo: this.selectedBatch.batchNo
    };

    this.stockService.adjustStockWithUnitsAndCartons(request).subscribe({
      next: (response) => {
        this.showSuccess(
          'Stock Adjusted',
          `Successfully adjusted stock. New quantity: ${response.newUnitQuantity}u (${response.newCartonQuantity}c)`
        );
        this.resetFormsAndReload();
      },
      error: (err) => {
        this.showError('Adjustment Failed', err);
        this.isLoading = false;
      }
    });
  }

  onStockTake(): void {
    if (this.stockTakeForm.invalid || !this.selectedBatch) return;

    this.isLoading = true;
    const request: StockTakeRequest = {
      ...this.stockTakeForm.value,
      batchNo: this.selectedBatch.batchNo
    };

    this.stockService.performStockTakeWithUnitsAndCartons(request).subscribe({
      next: (response) => {
        this.showSuccess(
          'Stock Take Completed',
          `Adjusted from ${response.previousUnitQuantity}u to ${response.newUnitQuantity}u`
        );
        this.resetFormsAndReload();
      },
      error: (err) => {
        this.showError('Stock Take Failed', err);
        this.isLoading = false;
      }
    });
  }

  resetFormsAndReload(): void {
    const currentProductId = this.activeTabIndex === 0
      ? this.adjustmentForm.value.productId
      : this.stockTakeForm.value.productId;

    this.loadProducts();
    this.loadHistory();

    if (this.activeTabIndex === 0) {
      this.adjustmentForm.reset({
        productId: currentProductId,
        userId: 1
      });
    } else {
      this.stockTakeForm.reset({
        productId: currentProductId,
        userId: 1
      });
    }

    this.isLoading = false;
  }

  loadHistory(): void {
    if (!this.selectedProduct) return;

    this.historyLoading = true;

    // Load both histories when history tab is active
    if (this.activeTabIndex === 2) {
      this.stockService.getAdjustmentHistory(
        this.selectedProduct.productId,
        this.selectedBatch?.batchNo
      ).subscribe({
        next: (history) => {
          this.adjustmentHistory = history;
          this.loadStockTakeHistory();
        },
        error: (err) => {
          this.showError('Failed to load adjustment history', err);
          this.historyLoading = false;
        }
      });
    }
  }

  loadStockTakeHistory(): void {
    if (!this.selectedProduct) return;

    this.stockService.getStockTakeHistory(
      this.selectedProduct.productId,
      this.selectedBatch?.batchNo
    ).subscribe({
      next: (history) => {
        this.stockTakeHistory = history;
        this.historyLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load stock take history', err);
        this.historyLoading = false;
      }
    });
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    if (this.activeTabIndex === 2) {
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

  calculateCartons(units: number, unitsPerCarton: number = 6): number {
    return Math.floor(units / unitsPerCarton);
  }

  calculateUnits(cartons: number, unitsPerCarton: number = 6): number {
    return cartons * unitsPerCarton;
  }
}
