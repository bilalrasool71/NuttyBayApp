import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { UtilsModule } from '../../core/utilities/utils.module';
import { IListOfValue } from '../../core/interfaces/common.interface';
import { IUser } from '../../core/interfaces/user.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { NBProductionRunPdf, ProductionRunDetailResponse, ProductStatus, UserProductionRunSummaryResponse } from '../../core/interfaces/production-run-detail.interface';
import { INBProduct, IProductionRunRequest } from '../../core/interfaces/domain.interface';
import { PdfService } from '../../core/services/pdf.service';
import { s3ProductionPdfpath } from '../../core/constant/constant';
import { ConfirmationService } from 'primeng/api';

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
  productionRunData!: ProductionRunDetailResponse;
  activeView !: 'in-progress' | 'completed' | 'new';
  params: any;

  summaryForUser: UserProductionRunSummaryResponse = { completed: [], inProgress: [] };
  constructor(
    private authService: AuthService,
    private router: Router,
    private restService: RestService,
    private pdfService: PdfService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {
    this.loggedInUser = this.authService.getUserData();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadUserSummary();
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  onCreateProductionRun(): void {
    const payload: IProductionRunRequest = {
      userId: this.loggedInUser.userId!,
      productionDate: this.formatLocalTime(new Date())
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
      next: (data) => {
        this.summaryForUser = data;
        if (this.route.snapshot.queryParams['view']) {
          this.activeView = this.route.snapshot.queryParams['view'] as 'in-progress' | 'completed';
          return;
        }

        // If no query parameter, determine view based on data
        if (data.completed.length > 0 && data.inProgress.length > 0) {
          // If both have data, default to completed
          this.activeView = 'completed';
        } else if (data.completed.length > 0) {
          this.activeView = 'completed';
        } else if (data.inProgress.length > 0) {
          this.activeView = 'in-progress';
        }
      },
      error: () => console.error('Error loading production run data.')
    });
  }

  navigateToChecklist(run: any): void {
    let activeTab: number = 1;
    if (!run.isPreMakingCompleted) {
      activeTab = 1;
    } else if (!run.isMakingCompleted) {
      activeTab = 2;
    } else if (!run.isPrePackingCompleted) {
      activeTab = 3;
    } else if (!run.isPackingCompleted) {
      activeTab = 4;
    } else if (!run.isPostPackingCompleted) {
      activeTab = 5;
    }
    this.router.navigate(['/app/checklist'], {
      queryParams: { productionId: run.productionRunId, activeTab: activeTab }
    });
  }

  parseValidBatchDate(validBatch: string): Date {
    if (!validBatch) return new Date();

    // Extract date part (last 6 characters)
    const datePart = validBatch.slice(-6);
    const day = parseInt(datePart.substring(0, 2));
    const month = parseInt(datePart.substring(2, 4)) - 1; // Months are 0-indexed
    const year = 2000 + parseInt(datePart.substring(4, 6)); // Assuming 21st century

    return new Date(year, month, day);
  }

  // Format for display (optional)
  formatValidBatchDate(validBatch: string): Date {
    return this.parseValidBatchDate(validBatch);
  }

  // Calculate progress percentage
  getValidityProgress(productionDate: Date | string, validBatch: string): number {
    const now = new Date();
    const start = new Date(productionDate);
    const end = this.parseValidBatchDate(validBatch);

    // If dates are invalid or expired
    if (!start || !end || now >= end) return 100;
    if (now <= start) return 0;

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();

    return Math.round((elapsedDuration / totalDuration) * 100);
  }

  generatePdfReport(run: any) {
    this.restService.getPdfByProductionRunId(Number(run.productionRunId)).subscribe({
      next: (existingPdf: NBProductionRunPdf) => {
        if (existingPdf != null && existingPdf.fileUrl) {
          window.open(s3ProductionPdfpath + existingPdf.fileUrl, '_blank');
        } else {
          this.generateAndOpenNewPdf(run);
        }
      },
      error: (err) => {
        console.error('Error checking for existing PDF:', err);
      }
    });
  }


  private generateAndOpenNewPdf(run: any) {
    this.restService.getProductionRunDetails(Number(run.productionRunId)).subscribe({
      next: (data) => {
        if (data) {
          this.productionRunData = data;
          this.pdfService.generateAndUploadProductionPdf(this.productionRunData)
            .then((result) => {
              window.open(result.pdfUrl, '_blank');
            })
            .catch((error) => {
              console.error('PDF generation/upload failed:', error);
            });
        } else {
          console.error('No production run data received.');
        }
      },
      error: (err) => {
        console.error('Error loading production run data:', err.message || err);
      }
    });
  }


  openExistingPdf(run: any) {
    this.restService.getPdfByProductionRunId(Number(run.productionRunId)).subscribe({
      next: (data: NBProductionRunPdf) => {
        if (data && data.fileUrl) {
          window.open(s3ProductionPdfpath + data.fileUrl, '_blank');
        }
      }
    });
  }
  generateAndOpenNewPdfLocal(run: any) {
    this.restService.getProductionRunDetails(Number(run.productionRunId)).subscribe({
      next: (data) => {
        this.productionRunData = data;
        this.pdfService.generateProductionPdf(this.productionRunData).subscribe({
          next: (response: any) => {
            if (response.Success) {
              window.open(response.FileUrl, '_blank');
            } else {
              console.error('Failed to generate PDF:', response.error);
            }
          },
          error: (error: any) => {
            console.error('Error generating PDF:', error);
          }
        });
      },
      error: (err) => {
        console.error('Error loading production run data:', err);
      }
    });
  }

  formatLocalTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  onNew() {
    this.confirmationService.confirm({
      message: 'Do you like to start the Production Run Now?',
      header: 'Production Start',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onCreateProductionRun();
      },
      reject: () => {
        // Reject logic if needed
      },
      acceptLabel: 'Yes',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-primary',
      rejectLabel: 'No',
      rejectIcon: 'pi pi-times',
      rejectButtonStyleClass: 'p-button-contrast',
      defaultFocus: 'reject'
    });
  }


}