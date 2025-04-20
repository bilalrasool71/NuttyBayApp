// rest.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBaseURL } from '../../core/constant/constant';
import { Observable } from 'rxjs';
import { 
  INBChecklist, 
  INBChecklistTasks, 
  INBProduct, 
  IProductionRunRequest,
  IProductionRun,
  IPrePackingData,
  UpdateTaskStatusRequest
} from '../../core/interfaces/domain.interface';

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

  getTasksByChecklist(checklistId: number): Observable<INBChecklistTasks[]> {
    return this.http.get<INBChecklistTasks[]>(
      `${this.baseUrl}/GetTasksOfCheckList?checklistId=${checklistId}`
    );
  }

  // Production Run methods
  createProductionRun(payload: IProductionRunRequest): Observable<IProductionRun> {
    return this.http.post<IProductionRun>(`${this.baseUrl}/CreateProductionRun`, payload);
  }

  getProductionRunDetails(productionRunId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetProductionRunDetails/${productionRunId}`);
  }

  // Task methods
  updateTaskStatus(taskId: number, payload: UpdateTaskStatusRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateTask/${taskId}`, payload);
  }

  completeChecklist(checklistId: number, payload: IPrePackingData): Observable<any> {
    return this.http.put(`${this.baseUrl}/CompleteChecklist/${checklistId}`, payload);
  }

  getUserProductionRuns(userId: number, status: 'InProgress' | 'Completed'): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetUserProductionRuns/${userId}/${status}`);
  }
  
}