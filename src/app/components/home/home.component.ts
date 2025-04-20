import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { UtilsModule } from '../../core/utilities/utils.module';
import { IListOfValue } from '../../core/interfaces/common.interface';
import { IUser } from '../../core/interfaces/user.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { INBProduct, IProductionRunRequest } from '../../core/interfaces/domain.interface';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
UtilsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  // User data
  loggedInUser: IUser;
  
  // Form data
  selectedProductId: number | null = null;
  selectedDate: Date = new Date();
  
  // Data collections
  products: INBProduct[] = [];
  inProgressRuns: any[] = [];
  completedRuns: any[] = [];
  
  // UI state
  loading = false;
  productionRunId: number | null = null;
  
  // Tabs configuration
  tabs: IListOfValue[] = [
    { value: 1, viewValue: 'In Progress' },
    { value: 2, viewValue: 'Completed' },
    { value: 3, viewValue: 'Create Production Run' }
  ];
  activeTab: number = 1;

  constructor(
    private authService: AuthService,
    private router: Router,
    private restService: RestService,
    private messageService: MessageService
  ) {
    this.loggedInUser = this.authService.getUserData();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loadInProgressRuns();
    this.loadProducts();
  }

  onTabChange(tabValue: any): void {
    this.activeTab = tabValue;
    
    switch (tabValue) {
      case 'inProgress':
        this.loadInProgressRuns();
        break;
      case 'completed':
        this.loadCompletedRuns();
        break;
      case 'create':
        if (this.products.length === 0) {
          this.loadProducts();
        }
        break;
    }
  }

  onCreateProductionRun(): void {
    if (!this.isFormValid()) {
      this.showFormValidationError();
      return;
    }

    this.loading = true;
    const payload: IProductionRunRequest = this.createProductionRunPayload();

    this.restService.createProductionRun(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => this.handleProductionRunSuccess(response),
        error: () => this.handleProductionRunError()
      });
  }

  private isFormValid(): boolean {
    return !!this.selectedDate && !!this.selectedProductId && !!this.loggedInUser.userId;
  }

  private showFormValidationError(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select both date and product'
    });
  }

  private createProductionRunPayload(): IProductionRunRequest {
    return {
      userId: this.loggedInUser.userId!,
      productId: this.selectedProductId!,
      runDate: this.selectedDate
    };
  }

  private handleProductionRunSuccess(response: any): void {
    this.productionRunId = response.productionRunId;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Production run created successfully'
    });
    this.navigateToChecklist(response);
  }

  private handleProductionRunError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create production run'
    });
  }

  private loadProducts(): void {
    this.restService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: () => this.showLoadError('products')
    });
  }

  private loadInProgressRuns(): void {
    if (!this.loggedInUser.userId) return;

    this.loading = true;
    this.restService.getUserProductionRuns(this.loggedInUser.userId, 'InProgress')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (runs) => this.inProgressRuns = runs,
        error: () => this.showLoadError('in-progress runs')
      });
  }

  private loadCompletedRuns(): void {
    if (!this.loggedInUser.userId) return;

    this.loading = true;
    this.restService.getUserProductionRuns(this.loggedInUser.userId, 'Completed')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (runs) => this.completedRuns = runs,
        error: () => this.showLoadError('completed runs')
      });
  }

  private showLoadError(dataType: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to load ${dataType}`
    });
  }

  navigateToChecklist(run: any): void {
    this.router.navigate(['/app/checklist'], {
      queryParams: {
        productId: run.productId,
        date: run.startTime,
        productionId: run.productionRunId
      }
    });
  }

  viewRunDetails(runId: number): void {
    this.router.navigate(['/app/run-details'], { 
      queryParams: { productionId: runId } 
    });
  }

  // UI Helper Methods
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getChecklistCompletion(checklists: any[]): number {
    // if (!checklists || checklists.length === 0) return 0;
    // const completed = checklists.filter(c => c.isCompleted).length;
    // return Math.round((completed / checklists.length) * 100);
    return 1;
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.productId === productId);
    return product ? product.productName : 'Unknown Product';
  }
}