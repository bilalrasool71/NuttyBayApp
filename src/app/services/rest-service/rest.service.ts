// rest.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBaseURL } from '../../core/constant/constant';
import { Observable } from 'rxjs';
import { 
  INBChecklist, 
  INBProduct, 
  IProductionRunRequest,
  IProductionRun,
} from '../../core/interfaces/domain.interface';

import { NBProductionRunPdf, NBProductionRunTaskUpdateDto, ProductionRunDetailResponse, SavePrePackingRequest, UpdateBoxCountRequest } from '../../core/interfaces/production-run-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) { }

  private baseUrl = `${apiBaseURL}NuttyBay`;

  // Product methods
  getAllProducts(): Observable<INBProduct[]> {
    return this.http.get<INBProduct[]>(`${this.baseUrl}/GetNBProducts`);
  }

  // Checklist methods
  getAllChecklists(): Observable<INBChecklist[]> {
    return this.http.get<INBChecklist[]>(`${this.baseUrl}/GetNBChecklists`);
  }

  // Production Run methods
  createProductionRun(payload: IProductionRunRequest): Observable<IProductionRun> {
    return this.http.post<IProductionRun>(`${this.baseUrl}/CreateProductionRun`, payload);
  }

  getProductionRunDetails(productionRunId: number): Observable<ProductionRunDetailResponse> {
    return this.http.get<ProductionRunDetailResponse>(`${this.baseUrl}/GetProductionRunDetails?productionRunId=${productionRunId}`);
  }

  updateTaskStatus(payload: NBProductionRunTaskUpdateDto[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/UpdateTaskStatuses`, payload);
  }

  savePrePackingData(request: SavePrePackingRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/SavePrePackingData`, request);
  }

  
  getUserProductionRuns(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetUserProductionSummary?userId=${userId}`);
  }

  getPdfByProductionRunId(productionRunId: number): Observable<NBProductionRunPdf> {
    return this.http.get<NBProductionRunPdf>(`${this.baseUrl}/GetPdfByProductionRunId?productionRunId=${productionRunId}`);
  }
  updateBoxCount(request: UpdateBoxCountRequest): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/UpdateBoxCount`, 
      request
    );
  }
  
}