// pdf.service.ts
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
  apiUrl = apiBaseURL+"NuttyBay/UploadNBProductionRunPdf";
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
        error: (pdfError:any) => {
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
      fileName: 'converted.pdf'
    };

    return this.http.post(this.api2pdfUrl, body, { headers });
  }

  // private generateHtmlTemplate(data: ProductionRunDetailResponse): string {
  //   const checklistOrder = [
  //     { id: 1, name: 'Pre-Making' },
  //     { id: 2, name: 'Making' },
  //     { id: 3, name: 'Pre-Packing' },
  //     { id: 4, name: 'Packing' }
  //   ];

  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //     <head>
  //       <style>
  //         /* Base Styles */
  //         body {
  //           font-family: Arial, sans-serif;
  //           margin: 0;
  //           padding: 20px 20px 0 20px;
  //           color: #333;
  //           line-height: 1.4;
  //         }
          
  //         /* Header Styles - Will repeat on every page */
  //         .header-container {
  //           display: flex;
  //           justify-content: space-between;
  //           align-items: flex-start;
  //           padding-bottom: 15px;
  //           border-bottom: 1px solid #e0e0e0;
  //           margin-bottom: 20px;
  //         }
          
  //         .logo-container {
  //           width: 120px;
  //         }
          
  //         .logo {
  //           height: 60px;
  //           width: auto;
  //         }
          
  //         .title-container {
  //           flex-grow: 1;
  //           text-align: center;
  //           padding: 0 20px;
  //         }
          
  //         .document-title {
  //           font-size: 24px;
  //           font-weight: bold;
  //           color: #2c3e50;
  //           margin-bottom: 3px;
  //         }
          
  //         .product-row {
  //           display: flex;
  //           flex-wrap: wrap;
  //           gap: 8px;
  //           justify-content: center;
  //           margin-top: 5px;
  //         }
          
  //         .product-tag {
  //           background: #f0f0f0;
  //           padding: 5px 10px;
  //           border-radius: 15px;
  //           font-size: 12px;
  //         }
          
  //         .user-container {
  //           text-align: right;
  //           width: 200px;
  //         }
          
  //         .user-info {
  //           font-size: 14px;
  //           color: #666;
  //           margin-bottom: 3px;
  //         }
          
  //         /* Checklist Styles */
  //         .page-section {
  //           page-break-after: always;
  //           padding-top: 10px;
  //         }
          
  //         .checklist-title {
  //           font-size: 18px;
  //           font-weight: bold;
  //           margin: 10px 0 15px 0;
  //           color: #2c3e50;
  //           border-bottom: 1px solid #eee;
  //           padding-bottom: 5px;
  //         }
          
  //         /* Table Styles */
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           margin-top: 15px;
  //           font-size: 13px;
  //         }
          
  //         th, td {
  //           border: 1px solid #ddd;
  //           padding: 8px;
  //           text-align: left;
  //         }
          
  //         th {
  //           background-color: #f5f5f5;
  //           font-weight: bold;
  //           text-align: center;
  //         }
          
  //         /* Status Indicators */
  //         .checkmark {
  //           color: #27ae60;
  //           font-weight: bold;
  //           text-align: center;
  //         }
          
  //         .cross {
  //           color: #e74c3c;
  //           font-weight: bold;
  //           text-align: center;
  //         }
          
  //         /* Column Widths */
  //         .col-task {
  //           width: 60%;
  //         }
          
  //         .col-status {
  //           width: 15%;
  //           text-align: center;
  //         }
          
  //         .col-date {
  //           width: 25%;
  //           text-align: center;
  //         }
          
  //         /* Completion Summary */
  //         .summary-section {
  //           padding-top: 10px;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <!-- Header Template (will repeat on every page) -->
  //       <header>
  //         <div class="header-container">
  //           <div class="logo-container">
  //             <img src="https://nuttybay.com.au/cdn/shop/files/Layer_4_600x200.png" class="logo" alt="Company Logo">
  //           </div>
            
  //           <div class="title-container">
  //             <div class="document-title">Production Report</div>
  //             <div class="product-row">
  //               ${data.products.map(product => `
  //                 <span class="product-tag">${product.productName + ' | ' + product.batchNoDate}</span>
  //               `).join('')}
  //             </div>
  //           </div>
            
  //           <div class="user-container">
  //             <div class="user-info">${this.loggedInUser.firstName} ${this.loggedInUser.lastName}</div>
  //             <div class="user-info">${this.formatDateTime(new Date(data.productionDate))}</div>
  //           </div>
  //         </div>
  //       </header>
        
  //       <!-- Pre-Making Checklist -->
  //       <div class="page-section">
  //         <div class="checklist-title">Pre-Making</div>
  //         ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 1))}
  //       </div>
        
  //       <!-- Making Checklist -->
  //       <div class="page-section">
  //         <div class="checklist-title">Making</div>
  //         ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 2))}
  //       </div>
        
  //       <!-- Pre-Packing Checklist -->
  //       <div class="page-section">
  //         <div class="checklist-title">Pre-Packing</div>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Product</th>
  //               <th>Batch#</th>
  //               <th>Temperature</th>
  //               <th>pH</th>
  //               <th>Time</th>
  //               <th class="col-status">Status</th>
  //               <th class="col-date">Completed At</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${data.prePackingList.map(item => `
  //               <tr>
  //                 <td>${item.productName}</td>
  //                 <td>${item.batchNoDate || 'N/A'}</td>
  //                 <td>${item.prePackingData.temperature || 'N/A'} ℃</td>
  //                 <td>${item.prePackingData.ph || 'N/A'}</td>
  //                 <td>${item.prePackingData.time ? this.formatTime(new Date(item.prePackingData.time)) : 'N/A'}</td>
  //                 <td class="${item.prePackingData.isCompleted ? 'checkmark' : 'cross'}">
  //                   ${item.prePackingData.isCompleted ? '✓' : '✗'}
  //                 </td>
  //                 <td class="col-date">
  //                   ${item.prePackingData.completedAt ?
  //       `${this.formatDate(new Date(item.prePackingData.completedAt))} ${this.formatTime(new Date(item.prePackingData.completedAt))}` :
  //       '-'}
  //                 </td>
  //               </tr>
  //             `).join('')}
  //           </tbody>
  //         </table>
  //       </div>
        
  //       <!-- Packing Checklist -->
  //       <div class="page-section">
  //         <div class="checklist-title">Packing</div>
  //         ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 4))}
  //       </div>
        
  //       <!-- Completion Summary -->
  //       <div class="summary-section">
  //         <div class="checklist-title">Completion Summary</div>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th class="col-task">Checklist</th>
  //               <th class="col-status">Status</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${checklistOrder.map(step => {
  //         const checklist = data.sharedChecklists.find(c => c.checklistId === step.id);
  //         if (!checklist) return '';

  //         return `
  //                 <tr>
  //                   <td>${step.name}</td>
  //                   <td class="${checklist.tasks.every(t => t.isCompleted) ? 'checkmark' : 'cross'}">
  //                     ${checklist.tasks.every(t => t.isCompleted) ? '✓ Completed' : '✗ Pending'}
  //                   </td>
  //                 </tr>
  //               `;
  //       }).filter(Boolean).join('')}
  //           </tbody>
  //         </table>
  //       </div>
  //     </body>
  //     </html>
  //   `;
  // }


  private generateHtmlTemplate(data: ProductionRunDetailResponse): string {
    const checklistOrder = [
      { id: 1, name: 'Pre-Making' },
      { id: 2, name: 'Making' },
      { id: 3, name: 'Pre-Packing' },
      { id: 4, name: 'Packing' }
    ];

    // Header template to be repeated on each page
    const headerTemplate = `
      <header style="position: fixed; top: 0; width: 100%; background: white; z-index: 100;">
        <div class="header-container">
          <div class="logo-container">
            <img src="https://nuttybay.com.au/cdn/shop/files/Layer_4_600x200.png" class="logo" alt="Company Logo">
          </div>
          
          <div class="title-container">
            <div class="document-title">Production Report</div>
            <div class="product-row">
              ${data.products.map(product => `
                <span class="product-tag">${product.productName + ' | ' + product.batchNoDate}</span>
              `).join('')}
            </div>
          </div>
          
          <div class="user-container">
            <div class="user-info">${this.loggedInUser.firstName} ${this.loggedInUser.lastName}</div>
            <div class="user-info">${this.formatDateTime(new Date(data.productionDate))}</div>
          </div>
        </div>
      </header>
    `;

    // Main content with proper page breaks
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Base Styles */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            // padding: 120px 20px 0 20px;
            color: #333;
            line-height: 1.4;
          }
          
          /* Header Styles */
          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .logo-container {
            width: 120px;
          }
          
          .logo {
            height: 60px;
            width: auto;
          }
          
          .title-container {
            flex-grow: 1;
            text-align: center;
            padding: 0 20px;
          }
          
          .document-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 3px;
          }
          
          .product-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            margin-top: 5px;
          }
          
          .product-tag {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
          }
          
          .user-container {
            text-align: right;
            width: 200px;
          }
          
          .user-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 3px;
          }
          
          /* Checklist Styles */
          .page-section {
            page-break-after: always;
            padding-top: 20px;
          }
          
          .checklist-title {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0 15px 0;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-top: 100px;
          }
          
          /* Table Styles */
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
          
          /* Status Indicators */
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
          
          /* Column Widths */
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
          
          /* Completion Summary */
          .summary-section {
            page-break-inside: avoid;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        ${headerTemplate}
        
        <!-- Pre-Making Checklist -->
        <div class="page-section">
          <div class="checklist-title">Pre-Making</div>
          ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 1))}
        </div>
        
        <!-- Making Checklist -->
        <div class="page-section">
          <div class="checklist-title">Making</div>
          ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 2))}
        </div>
        
        <!-- Pre-Packing Checklist -->
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
                <th class="col-status">Status</th>
                <th class="col-date">Completed At</th>
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
                  <td class="${item.prePackingData.isCompleted ? 'checkmark' : 'cross'}">
                    ${item.prePackingData.isCompleted ? '✓' : '✗'}
                  </td>
                  <td class="col-date">
                    ${item.prePackingData.completedAt ?
                      `${this.formatDate(new Date(item.prePackingData.completedAt))} ${this.formatTime(new Date(item.prePackingData.completedAt))}` : 
                      '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Packing Checklist -->
        <div class="page-section">
          <div class="checklist-title">Packing</div>
          ${this.generateChecklistTable(data.sharedChecklists.find(c => c.checklistId === 4))}
        </div>
        
        <!-- Completion Summary -->
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
    if (!checklist) return '';

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