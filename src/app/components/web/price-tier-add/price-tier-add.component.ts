import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { HeaderComponent } from '../header/header.component';
import { MessageService } from 'primeng/api';
import { RestService } from '../../../services/rest-service/rest.service';

@Component({
  selector: 'app-price-tier-add',
  imports: [UtilsModule, HeaderComponent],
  templateUrl: './price-tier-add.component.html',
  styleUrl: './price-tier-add.component.scss',
  providers: [MessageService]
})
export class PriceTierAddComponent {
 tierName: string = '';
  tierCustomName: string = '';
  products: any[] = [];
  loading: boolean = false;
  submitted: boolean = false;
  isSubmitted: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private restService: RestService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.restService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          price: null
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Validate tier name
    if (!this.tierName || this.tierName.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Tier name is required'
      });
      return;
    }

    // Prepare product prices (replace null/empty with 0)
    const productPrices = this.products.map(product => ({
      productId: product.productId,
      price: product.price === null || product.price === undefined || product.price === '' ? 0 : Number(product.price)
    }));

    const newTier = {
      tierName: this.tierName,
      tierCustomName: this.tierCustomName,
      productPrices: productPrices
    };

    this.isSubmitted = true;
    this.restService.createPriceTierWithPrices(newTier).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Price tier created successfully'
        });
        this.isSuccess = true;
        this.isSubmitted = false;
      },
      error: (err) => {
        console.error('Error creating price tier:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to create price tier'
        });
        this.isSubmitted = false;
      }
    });
  }

  resetForm(): void {
    this.tierName = '';
    this.tierCustomName = '';
    this.products.forEach(product => product.price = null);
    this.submitted = false;
    this.isSuccess = false;
  }

  createNew(): void {
    this.resetForm();
    this.loadProducts();
  }
}
