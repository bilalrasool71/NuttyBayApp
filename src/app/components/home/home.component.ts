import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { UtilsModule } from '../../core/utilities/utils.module';
import { IListOfValue } from '../../core/interfaces/common.interface';
import { IUser } from '../../core/interfaces/user.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { NBProductionRunPdf, ProductionRunDetailResponse, ProductStatus, UserProductionRunSummaryResponse } from '../../core/interfaces/production-run-detail.interface';
import { INBProduct, IProductionRunRequest } from '../../core/interfaces/domain.interface';
import { PdfService } from '../../core/services/pdf.service';
import { s3ProductionPdfpath } from '../../core/constant/constant';

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
  activeView: 'in-progress' | 'completed' | 'new' = 'in-progress';

  summaryForUser: UserProductionRunSummaryResponse = { completed: [], inProgress: [] };
  constructor(
    private authService: AuthService,
    private router: Router,
    private restService: RestService,
    private pdfService: PdfService
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
      productionDate: this.formatLocalTime(new Date(this.selectedDate))
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

  async loadUserSummary(): Promise<void> {
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
}