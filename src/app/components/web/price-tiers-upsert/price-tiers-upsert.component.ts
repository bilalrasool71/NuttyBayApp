import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { RestService } from '../../../services/rest-service/rest.service';
import { PriceTier } from '../../../core/interfaces/price-tier';

@Component({
  selector: 'app-price-tiers-upsert',
  imports: [UtilsModule],
  templateUrl: './price-tiers-upsert.component.html',
  styleUrls: ['./price-tiers-upsert.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PriceTiersUpsertComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  priceTiers: PriceTier[] = [];
  productPrices: ProductPriceDto[] = [];
  filteredProducts: ProductPriceDto[] = [];
  loading: boolean = true;
  skeletonItems = Array(5).fill(0);
  globalFilterValue: string = '';
  selectedPriceTier: number | null = null;
  editMode: boolean = false;
  editedPrices: { [key: number]: number } = {};

  constructor(
    private restService: RestService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPriceTiers();
  }

  loadPriceTiers(): void {
    this.loading = true;
    this.restService.getPriceTiers().subscribe({
      next: (data) => {
        this.priceTiers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading price tiers:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load price tiers'
        });
        this.loading = false;
      }
    });
  }

  loadProductPrices(priceTierId: number): void {
    this.loading = true;
    this.selectedPriceTier = priceTierId;
    this.restService.getProductPricesByTier(this.selectedPriceTier).subscribe({
      next: (data) => {
        this.productPrices = data;
        this.filteredProducts = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product prices:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load product prices'
        });
        this.loading = false;
      }
    });
  }

  applyGlobalFilter(): void {
    if (!this.globalFilterValue) {
      this.filteredProducts = [...this.productPrices];
      return;
    }

    const searchText = this.globalFilterValue.toLowerCase();
    this.filteredProducts = this.productPrices.filter(item => {
      return (
        item.productName.toLowerCase().includes(searchText) ||
        (item.unit.toLowerCase().includes(searchText)
      ));
    });
  }

  clearFilters(): void {
    this.globalFilterValue = '';
    this.filteredProducts = [...this.productPrices];
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editedPrices = {};
    }
  }

  onPriceChange(productId: number, newPrice: any): void {
    const price = parseFloat(newPrice.target.value);
    if (!isNaN(price)) {
      this.editedPrices[productId] = price;
    }
  }


  savePriceChanges(): void {
  if (Object.keys(this.editedPrices).length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Changes',
      detail: 'No price changes were made'
    });
    return;
  }

  const updates = Object.keys(this.editedPrices).map(productId => ({
    productId: +productId,
    priceTierId: this.selectedPriceTier!,
    newPrice: this.editedPrices[+productId]
  }));

  this.loading = true;
  this.restService.updateProductPrices(updates).subscribe({
    next: (result) => {
      if (result.failedUpdates && result.failedUpdates.length > 0) {
        // Handle partial success
        const failedCount = result.failedUpdates.length;
        const successCount = updates.length - failedCount;
        
        this.messageService.add({
          severity: 'warn',
          summary: 'Partial Success',
          detail: `Updated ${successCount} prices. ${failedCount} failed.`,
          life: 5000
        });

        // Show details for failed updates
        result.failedUpdates.forEach(failed => {
          const product = this.productPrices.find(p => p.productId === failed.productId);
          const productName = product ? product.productName : 'Unknown product';
          
          this.messageService.add({
            severity: 'error',
            summary: `Update failed for ${productName}`,
            detail: failed.error,
            life: 7000
          });
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Updated ${result.updatedCount} prices successfully`
        });
      }

      // Refresh data
      this.loadProductPrices(this.selectedPriceTier!);
      this.editMode = false;
      this.editedPrices = {};
    },
    error: (err) => {
      console.error('Error updating prices:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: err.message || 'Failed to update prices'
      });
      this.loading = false;
    }
  });
}
  cancelEdit(): void {
    this.editMode = false;
    this.editedPrices = {};
  }
}

interface ProductPriceDto {
  productId: number;
  productName: string;
  unit: string;
  priceTierId: number;
  priceTierName: string;
  priceTierCustomName: string;
  productPrice: number;
}