import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseURL } from '../../core/constant/constant';
import { Branch } from '../../core/interfaces/branch';
import { ContactEntity } from '../../core/interfaces/contact';
import { ContactEmptyFieldsReport } from '../../core/interfaces/contact-empty-fields-report';
import { DataTablesResponse } from '../../core/interfaces/datatables-response';
import { Group } from '../../core/interfaces/group';
import { Island } from '../../core/interfaces/Island';
import { MonthlySales } from '../../core/interfaces/monthly-sales';
import { PackingSlip } from '../../core/interfaces/packing-slip';
import { PriceTier } from '../../core/interfaces/price-tier';
import { PriceTierReport } from '../../core/interfaces/price-tier-report';
import { ProductSales } from '../../core/interfaces/product-sales';
import { SalesRep } from '../../core/interfaces/sales-rep';
import { SalesTeam } from '../../core/interfaces/sales-team';
import { StoreProductRatesMatrixDTO } from '../../core/interfaces/store-product-rates-matrix-dto';
import { SubGroup } from '../../core/interfaces/sub-group';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  baseURL = `${apiBaseURL}api/Contacts`;
  constructor(private http: HttpClient) {
  }

  getContactsPagination(tableQuery: any, isActive: any, customerType: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.baseURL + `/GetContacts?isActive=${isActive}&customerType=${customerType}`, tableQuery);
  }
  getContactProductsReport(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.baseURL + "/GetContactProductsReport", tableQuery);
  }
  GetCompanyBySearchTerm(bannerId: any, searchText: any): Observable<ContactEntity[]> {
    return this.http.get<ContactEntity[]>(`${this.baseURL}/GetCompanyBySearchTerm?search=${searchText}&bannerId=${bannerId}`);
  }
  getCompaniesByBannerId(bannerId: any, bannerCategoryId: any): Observable<ContactEntity[]> {
    return this.http.get<ContactEntity[]>(`${this.baseURL}/getCompaniesByBannerId?bannerId=${bannerId}&bannerCategoryId=${bannerCategoryId}`);
  }
  GetCompaniesByType(type: any): Observable<ContactEntity[]> {
    return this.http.get<ContactEntity[]>(`${this.baseURL}/GetCompaniesByType?type=${type}`);
  }
  getStoreProductRatesReportByStoreId(storeId: any): Observable<StoreProductRatesMatrixDTO[]> {
    return this.http.get<StoreProductRatesMatrixDTO[]>(`${this.baseURL}/GetStoreProductRatesReportByStoreId?storeId=${storeId}`);
  }
  getStoreByBannerIdAndAuditFrequencyId(bannerId: any, auditFrequencyId: any, storeReqType: any): Observable<ContactEntity[]> {
    return this.http.get<ContactEntity[]>(`${this.baseURL}/GetStoreByBannerIdAndAuditFrequencyId?bannerId=${bannerId}&auditFrequencyId=${auditFrequencyId}&storeReqType=${storeReqType}`);
  }
  getBannerAndStoreSalesHistory(productId: any, bannerId: any, bannerCategoryId: any, storeId: any): Observable<ProductSales[]> {
    return this.http.get<ProductSales[]>(`${this.baseURL}/BannerAndStoreSalesHistory?bannerId=${bannerId}&storeId=${storeId}&bannerCategoryId=${bannerCategoryId}&productId=${productId}`);
  }
  GetIndependentBannerAndStoreSalesHistory(bannerId: any, productId: any, startDate: any, endDate: any, isIndependent: any): Observable<ProductSales[]> {
    return this.http.get<ProductSales[]>(`${this.baseURL}/GetIndependentBannerAndStoreSalesHistory?bannerId=${bannerId}&productId=${productId}
      &startDate=${startDate}&endDate=${endDate}&isIndependent=${isIndependent}`);
  }
  UpdateStoreProductRangingStatus(formData: any, productId: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.baseURL}/UpdateStoreProductRangingStatus?productId=${productId}`, formData);
  }
  GetContactEmptyFieldsReport(isActive: any, customerType: any): Observable<ContactEmptyFieldsReport> {
    return this.http.get<ContactEmptyFieldsReport>(`${this.baseURL}/GetContactEmptyFieldsReport?isActive=${isActive}&customerType=${customerType}`);
  }
  GetPriceTier(): Observable<PriceTierReport[]> {
    return this.http.get<PriceTierReport[]>(`${this.baseURL}/GetPriceTier`);
  }
  GetIslands(): Observable<Island[]> {
    return this.http.get<Island[]>(`${this.baseURL}/GetIslands`);
  }
  GetSalesTeam(): Observable<SalesTeam[]> {
    return this.http.get<SalesTeam[]>(`${this.baseURL}/GetSalesTeam`);
  }
  SyncContactByName(name: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/SyncContactByName?name=${name}`);
  }
  GetPriceTiers(): Observable<PriceTier[]> {
    return this.http.get<PriceTier[]>(`${this.baseURL}/GetPriceTiers`);
  }
  GetPackingSlips(): Observable<PackingSlip[]> {
    return this.http.get<PackingSlip[]>(`${this.baseURL}/GetPackingSlips`);
  }
  GetGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseURL}/GetGroups`);
  }
  GetSubGroups(): Observable<SubGroup[]> {
    return this.http.get<SubGroup[]>(`${this.baseURL}/GetSubGroups`);
  }
  GetSalesReps(): Observable<SalesRep[]> {
    return this.http.get<SalesRep[]>(`${this.baseURL}/GetSalesReps`);
  }
  saveNewStore(store: any): Observable<any> {
    return this.http.post(`${this.baseURL}/saveNewStore`, store);
  }
  updateReplyEmail(storeId: any, replyEmail: any, pwd: any, isSendInvitation: any): Observable<any> {
    return this.http.get(`${this.baseURL}/UpdateReplyEmail?storeId=${storeId}&replyEmail=${replyEmail}&pwd=${pwd}&isSendInvitation=${isSendInvitation}`);
  }
  getAccountNumberByBannerCategoryId(bannerCategoryId: any): Observable<any> {
    return this.http.get(`${this.baseURL}/getAccountNumberByBannerCategoryId?bannerCategoryId=${bannerCategoryId}`);
  }
  getCompaniesByIndepenentBannerId(independentBannerId: any): Observable<ContactEntity[]> {
    return this.http.get<ContactEntity[]>(`${this.baseURL}/getCompaniesByIndepenentBannerId?independentBannerId=${independentBannerId}`);
  }
  getProductForecastingReport(bannerId: any, startDate: any, endDate: any, isIndependent: any): Observable<MonthlySales[]> {
    return this.http.get<MonthlySales[]>(`${this.baseURL}/getProductForecastingReport?bannerId=${bannerId}
      &startDate=${startDate}&endDate=${endDate}&isIndependent=${isIndependent}`);
  }
  GetProductForecastingReportByProduct(name: any, startDate: any, endDate: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetProductForecastingReportByProduct?name=${name}
      &startDate=${startDate}&endDate=${endDate}`);
  }
  GetHistoryOfProductForeCasting(name: any, startDate: any, endDate: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetHistoryOfProductForeCasting?name=${name}
      &startDate=${startDate}&endDate=${endDate}`);
  }
  GetStoreById(storeId: any): Observable<ContactEntity> {
    return this.http.get<ContactEntity>(`${this.baseURL}/GetStoreById?storeId=${storeId}`);
  }
  GetContactByCin7Id(storeId: any): Observable<ContactEntity> {
    return this.http.get<ContactEntity>(`${this.baseURL}/GetContactByCin7Id?storeId=${storeId}`);
  }
  updateStore(store: any): Observable<any> {
    return this.http.post(`${this.baseURL}/updateStore`, store);
  }
  GetBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.baseURL}/GetBranches`);
  }
  UpdateBranches(branches: any[]): Observable<any> {
    return this.http.put(`${this.baseURL}/UpdateBranches`, branches);
  }
  GetContactsByUserIdAndIsland(userId: any, islandId: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetContactsByUserIdAndIsland?userId=${userId}&islandId=${islandId}`);
  }
  AssignUserToStore(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/AssignUserToStore`, data);
  }
  GetStoresForGroceryAudit(bannerId: any, islandId: any, userId: any): Observable<ContactEntity[]> {
    return this.http.get<ContactEntity[]>(`${this.baseURL}/GetStoresForGroceryAudit?bannerId=${bannerId}&islandId=${islandId}&userId=${userId}`);
  }
}
