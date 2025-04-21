import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { UtilsModule } from '../../core/utilities/utils.module';
import { IListOfValue } from '../../core/interfaces/common.interface';
import { IUser } from '../../core/interfaces/user.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { UserProductionRunSummaryResponse } from '../../core/interfaces/production-run-detail.interface';
import { INBProduct, IProductionRunRequest } from '../../core/interfaces/domain.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UtilsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedInUser: IUser;
  selectedProductIds: number[] = [];
  selectedDate: Date = new Date();
  products: INBProduct[] = [];
  summaryForUser: UserProductionRunSummaryResponse = { completed: [], inProgress: [] };
  tabs: IListOfValue[] = [
    { value: 1, viewValue: 'In Progress' },
    { value: 2, viewValue: 'Completed' },
    { value: 3, viewValue: 'Create Production Run' }
  ];
  constructor(
    private authService: AuthService,
    private router: Router,
    private restService: RestService
  ) {
    this.loggedInUser = this.authService.getUserData();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadUserSummary();
  }

  onCreateProductionRun(): void {
    if (!this.selectedDate || !this.selectedProductIds.length) {
      alert('Please select both date and product.');
      return;
    }

    const payload: IProductionRunRequest = {
      userId: this.loggedInUser.userId!,
      productIds: this.selectedProductIds,
      productionDate: this.selectedDate
    };

    this.restService.createProductionRun(payload).subscribe({
      next: (response) => {
        this.navigateToChecklist(response);
      },
      error: () => {
        alert('Failed to create production run.');
      }
    });
  }

  loadProducts(): void {
    this.restService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: () => alert('Failed to load products.')
    });
  }

  loadUserSummary(): void {
    this.restService.getUserProductionRuns(Number(this.loggedInUser.userId)).subscribe({
      next: (data) => this.summaryForUser = data,
      error: () => console.error('Error loading production run data.')
    });
  }

  navigateToChecklist(run: any): void {
    this.router.navigate(['/app/checklist'], {
      queryParams: { productionId: run.productionRunId }
    });
  }

}