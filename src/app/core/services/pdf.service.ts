import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductionRunDetailResponse } from '../interfaces/production-run-detail.interface';
import { apiBaseURL, baseURL, pdfKey } from '../constant/constant';
import { AuthService } from './auth-service/auth.service';
import { IUser } from '../interfaces/user.interface';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private api2pdfUrl = 'https://v2.api2pdf.com/chrome/pdf/html';
  apiUrl = apiBaseURL + "NuttyBay/UploadNBProductionRunPdf";
  private apiKey = pdfKey;
  private loggedInUser: IUser = {};

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = this.authService.getUserData();
    }
  }

  generateAndUploadProductionPdf(productionData: ProductionRunDetailResponse): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generateProductionPdf(productionData).subscribe({
        next: (pdfResponse: any) => {
          if (pdfResponse.Success) {
            this.uploadPdfToServer(
              productionData.productionRunId,
              pdfResponse.FileUrl,
              `ProductionReport_${productionData.productionRunId}.pdf`
            ).subscribe({
              next: (uploadResponse) => {
                resolve({
                  pdfUrl: pdfResponse.FileUrl,
                  serverResponse: uploadResponse
                });
              },
              error: (uploadError) => {
                reject(uploadError);
              }
            });
          } else {
            reject(pdfResponse.error);
          }
        },
        error: (pdfError: any) => {
          reject(pdfError);
        }
      });
    });
  }

  private uploadPdfToServer(productionRunId: number, pdfUrl: string, fileName: string) {
    return this.http.get(pdfUrl, { responseType: 'blob' }).pipe(
      switchMap(blob => {
        const formData = new FormData();
        formData.append('productionRunId', productionRunId.toString());
        formData.append('pdfFile', blob, fileName);
        const headers = new HttpHeaders();
        return this.http.post(this.apiUrl, formData, { headers });
      })
    );
  }

  generateProductionPdf(productionData: ProductionRunDetailResponse): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${this.apiKey}`
    });

    const body = {
      html: this.generateHtmlTemplate(productionData),
      inline: true,
      fileName: `ProductionReport_${productionData.productionRunId}.pdf`
    };

    return this.http.post(this.api2pdfUrl, body, { headers });
  }

  private generateHtmlTemplate(data: ProductionRunDetailResponse): string {
    console.log(data)
    const checklistOrder = [
      { id: 1, name: 'Pre-Making' },
      { id: 2, name: 'Making' },
      { id: 3, name: 'Pre-Packing' },
      { id: 4, name: 'Packing' }
    ];

    const headerTemplate = `
      <header style="position: fixed; top: -30px; width: 100%; background: white; z-index: 100; padding-top: 30px;">
        <div class="header-container" style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
          <div class="logo-container" style="width: 120px;">
            <img src="https://nuttybay.com.au/cdn/shop/files/Layer_4_600x200.png" class="logo" alt="Company Logo" style="height: 60px; width: auto;">
          </div>
          
          <div class="title-container" style="flex-grow: 1; text-align: center; padding: 0 20px;">
            <div class="document-title" style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 3px;">Production Report</div>
            <div class="product-row" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 5px;">
              ${data.products.map(product => `
                <span class="product-tag" style="background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                  ${product.productName + ' | ' + product.batchNoDate}
                </span>
              `).join('')}
            </div>
          </div>
          
          <div class="user-container" style="text-align: right; width: 200px;">
            <div class="user-info" style="font-size: 14px; color: #666; margin-bottom: 3px;">
              ${this.loggedInUser.firstName} ${this.loggedInUser.lastName}
            </div>
            <div class="user-info" style="font-size: 14px; color: #666; margin-bottom: 3px;">
              ${this.formatDateTime(new Date(data.productionDate))}
            </div>
          </div>
        </div>
      </header>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            color: #333;
            line-height: 1.4;
            // padding-top: 120px;
          }
          
          .page-section {
            page-break-after: always;
            padding-top: 100px;
          }
          
          .checklist-title {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0 15px 0;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 13px;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: bold;
            text-align: center;
          }
          
          .checkmark {
            color: #27ae60;
            font-weight: bold;
            text-align: center;
          }
          
          .cross {
            color: #e74c3c;
            font-weight: bold;
            text-align: center;
          }
          
          .col-task {
            width: 60%;
          }
          
          .col-status {
            width: 15%;
            text-align: center;
          }
          
          .col-date {
            width: 25%;
            text-align: center;
          }
          
          .summary-section {
            page-break-inside: avoid;
            padding-top: 20px;
          }
          
          .quantities-section {
            page-break-inside: avoid;
            margin-top: 20px;
            background: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .quantities-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
          }
          
          .quantities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .product-quantity {
            background: white;
            border-radius: 6px;
            padding: 12px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .product-name {
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .batch-number {
            font-size: 12px;
            color: #718096;
            margin-bottom: 10px;
          }
          
          .quantity-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
          }
          
          .quantity-label {
            color: #4a5568;
          }
          
          .quantity-value {
            font-weight: 600;
            color: #2d3748;
          }
          
          .total-jars {
            background: #edf2f7;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
            font-weight: 600;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${headerTemplate}
        
        <div class="page-section">
          <div class="checklist-title">Pre-Making</div>
          ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 1))}
        </div>
        
        <div class="page-section">
          <div class="checklist-title">Making</div>
          ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 2))}
        </div>
        
        <div class="page-section">
          <div class="checklist-title">Pre-Packing</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch#</th>
                <th>Temperature</th>
                <th>pH</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              ${data.prePackingList.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.batchNoDate || 'N/A'}</td>
                  <td>${item.prePackingData.temperature || 'N/A'} ℃</td>
                  <td>${item.prePackingData.ph || 'N/A'}</td>
                  <td>${item.prePackingData.time ? this.formatDateTime(new Date(item.prePackingData.time)) : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="page-section">
          <div class="checklist-title">Packing</div>
          ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 4))}
        </div>
        
        <div class="quantities-section">
          <div class="quantities-title">Production Quantities</div>
          <div class="quantities-grid">
            ${data.products.map(product => `
              <div class="product-quantity">
                <div class="product-name">${product.productName}</div>
                <div class="batch-number">${product.batchNoDate || 'N/A'}</div>
                
                <div class="quantity-row">
                  <span class="quantity-label">Boxes Produced:</span>
                  <span class="quantity-value">${product.numberOfBoxes || 0}</span>
                </div>
                
                <div class="quantity-row">
                  <span class="quantity-label">Units per Box:</span>
                  <span class="quantity-value">${product.unit || 0}</span>
                </div>
                
                <div class="total-jars">
                  Total Jars: ${(product.numberOfBoxes || 0) * (product.unit || 0)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="summary-section">
          <div class="checklist-title">Completion Summary</div>
          <table>
            <thead>
              <tr>
                <th class="col-task">Checklist</th>
                <th class="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              ${checklistOrder.map(step => {
                if (step.id === 3) {
                  const hasPrePacking = data.prePackingList && data.prePackingList.length > 0;
                  const allCompleted = hasPrePacking ? 
                    data.prePackingList.every(item => item.prePackingData.isCompleted) : 
                    false;
                  
                  return `
                    <tr>
                      <td>${step.name}</td>
                      <td class="${allCompleted ? 'checkmark' : 'cross'}">
                        ${hasPrePacking ? 
                          (allCompleted ? '✓ Completed' : '✗ Pending') : 
                          '✗ Not Started'}
                      </td>
                    </tr>
                  `;
                }
                
                const checklist = data.sharedChecklists.find(c => c.checklistId === step.id);
                const hasChecklist = checklist && checklist.tasks && checklist.tasks.length > 0;
                const allCompleted = hasChecklist ? 
                  checklist.tasks.every(t => t.isCompleted) : 
                  false;
                
                return `
                  <tr>
                    <td>${step.name}</td>
                    <td class="${allCompleted ? 'checkmark' : 'cross'}">
                      ${hasChecklist ? 
                        (allCompleted ? '✓ Completed' : '✗ Pending') : 
                        '✗ Not Started'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  }

  private generateChecklistTable(checklist: any): string {
    if (!checklist) return '<p>No checklist data available</p>';

    return `
      <table>
        <thead>
          <tr>
            <th class="col-task">Task</th>
            <th class="col-status">Status</th>
            <th class="col-date">Completed At</th>
          </tr>
        </thead>
        <tbody>
          ${checklist.tasks.map((task: any) => `
            <tr>
              <td class="col-task">${task.taskDescription}</td>
              <td class="col-status ${task.isCompleted ? 'checkmark' : 'cross'}">
                ${task.isCompleted ? '✓' : '✗'}
              </td>
              <td class="col-date">
                ${task.completedAt ?
                  `${this.formatDate(new Date(task.completedAt))} ${this.formatTime(new Date(task.completedAt))}` :
                  '-'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB');
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/^0/, '');
  }

  private formatDateTime(date: Date): string {
    return `${this.formatDate(date)}, ${this.formatTime(date)}`;
  }
}