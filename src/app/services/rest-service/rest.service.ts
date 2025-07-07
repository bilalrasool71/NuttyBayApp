// rest.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  INBChecklist,
  INBProduct,
  IProductionRunRequest,
  IProductionRun,
} from '../../core/interfaces/domain.interface';

import { NBProductionRunPdf, NBProductionRunTaskUpdateDto, ProductionRunDetailResponse, SavePrePackingRequest, UpdateBoxCountRequest, UpdateChecklistDateRequest } from '../../core/interfaces/production-run-detail.interface';
import { apiBaseURL } from '../../core/constant/constant';
import { ProductionRunReportDto } from '../../core/interfaces/productionRunReportDto';
import { DatePipe } from '@angular/common';
import { ProductPriceDto } from '../../core/interfaces/productPriceDto';
import { PriceTier, PriceUpdateDto, UpdateResultDto } from '../../core/interfaces/price-tier';
import { ProductStockLevel, BatchStockLevel, StockAdjustmentRequest, StockAdjustmentResponse, StockTakeRequest, StockTakeResponse, StockAdjustmentHistory, StockTakeHistory } from '../../core/interfaces/stock-adjustment';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  private baseUrl = `${apiBaseURL}api/NuttyBay`;

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

  updateChecklistDate(request: UpdateChecklistDateRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateChecklistDate`, request)
  }

  deletePrePackingDetail(productionRunId: number, detailId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeletePrePackingDetail?productionRunId=${productionRunId}&detailId=${detailId}`)
  }

  deleteProductionRun(productionRunId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteProductionRun?productionRunId=${productionRunId}`);
  }

  deleteTestingData(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteTestingData?userId=${userId}`);
  }

  getProductionRunReports(sDate: Date, eDate: Date): Observable<ProductionRunReportDto[]> {
    // Format dates consistently
    const params = new HttpParams()
      .set('startDate', this.formatDateForApi(sDate))
      .set('endDate', this.formatDateForApi(eDate));

    return this.http.get<ProductionRunReportDto[]>(
      `${this.baseUrl}/GetProductionRunReports`,
      { params }
    );
  }

  getProductPricesByTier(priceTierId: number): Observable<ProductPriceDto[]> {
    return this.http.get<ProductPriceDto[]>(`${this.baseUrl}/GetProductPricesByTier?priceTierId=${priceTierId}`);
  }

  getPriceTiers(): Observable<PriceTier[]> {
    return this.http.get<PriceTier[]>(`${this.baseUrl}/GetPriceTiers`);
  }

  updateProductPrices(updates: PriceUpdateDto[]): Observable<UpdateResultDto> {
    return this.http.put<UpdateResultDto>(`${this.baseUrl}/UpdatePrices`, updates);
  }


  createPriceTierWithPrices(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertNewPriceTier`, data);
  }

  getProductWiseSalesReportMonthly(year: number, month: number, isDispatched: boolean): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetProductWiseSalesReportMonthly?year=${year}&month=${month}&isDispatched=${isDispatched.toString()}`);
  }

  getMonthlySalesOrders(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetMonthlySalesOrderReport?year=${year}&month=${month}`);
  }


  getProductStockLevels(): Observable<ProductStockLevel[]> {
    return this.http.get<ProductStockLevel[]>(`${this.baseUrl}/GetProductStockLevels`);
  }

  getBatchStockLevels(productId: number): Observable<BatchStockLevel[]> {
    return this.http.get<BatchStockLevel[]>(`${this.baseUrl}/GetBatchStockLevels/${productId}`);
  }

  adjustStock(request: StockAdjustmentRequest): Observable<StockAdjustmentResponse> {
    return this.http.post<StockAdjustmentResponse>(`${this.baseUrl}/AdjustStock`, request);
  }

  adjustStockWithUnitsAndCartons(request: StockAdjustmentRequest): Observable<StockAdjustmentResponse> {
    return this.http.post<StockAdjustmentResponse>(`${this.baseUrl}/AdjustStockWithUnitsAndCartons`, request);
  }

  // Stock Takes
  performStockTake(request: StockTakeRequest): Observable<StockTakeResponse> {
    return this.http.post<StockTakeResponse>(`${this.baseUrl}/PerformStockTake`, request);
  }

  performStockTakeWithUnitsAndCartons(request: StockTakeRequest): Observable<StockTakeResponse> {
    return this.http.post<StockTakeResponse>(`${this.baseUrl}/PerformStockTakeWithUnitsAndCartons`, request);
  }

  getAdjustmentHistory(productId?: number, batchNo?: string): Observable<StockAdjustmentHistory[]> {
    let url = `${this.baseUrl}/GetAdjustmentHistory`;
    if (productId || batchNo) {
      url += '?';
      if (productId) url += `productId=${productId}`;
      if (batchNo) url += `&batchNo=${batchNo}`;
    }
    return this.http.get<StockAdjustmentHistory[]>(url);
  }

  getStockTakeHistory(productId?: number, batchNo?: string): Observable<StockTakeHistory[]> {
    let url = `${this.baseUrl}/GetStockTakeHistory`;
    if (productId || batchNo) {
      url += '?';
      if (productId) url += `productId=${productId}`;
      if (batchNo) url += `&batchNo=${batchNo}`;
    }
    return this.http.get<StockTakeHistory[]>(url);
  }




  private formatDateForApi(date: Date): string {
    // Use ISO format (YYYY-MM-DD) for API consistency
    return date.toISOString().split('T')[0];
  }
}