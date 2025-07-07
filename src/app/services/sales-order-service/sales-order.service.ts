import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseURL } from '../../core/constant/constant';
import { BannerProductPricingReport } from '../../core/interfaces/banner-product-pricing-report';
import { BranchOrderItemReport } from '../../core/interfaces/branch-order-Item-report';
import { DataTablesResponse } from '../../core/interfaces/datatables-response';
import { EmailLog } from '../../core/interfaces/email-log';
import { FoodStuffPoDTO } from '../../core/interfaces/food-stuff-po';
import { ImportFoodStuffOrder } from '../../core/interfaces/import-foodstuff-dto';
import { ProductMonthSales } from '../../core/interfaces/product-month-sales';
import { ProductSales } from '../../core/interfaces/product-sales';
import { SalesOrderItemReport } from '../../core/interfaces/sale-order-item-report';
import { SalesDashboardByDateRangeReport } from '../../core/interfaces/sales-bystages';
import { SalesOrder } from '../../core/interfaces/sales-order';
import { Setting } from '../../core/interfaces/setting';
import { WoolWorthPO } from '../../core/interfaces/woolworth-po';
import { ReconciliationReportDto } from '../../core/interfaces/ReconciliationReport';
import { DispatchUpdateRequest, SalesOrderWithHeaderAndItemsDto } from '../../core/interfaces/SalesorderDto';
import { ProductProduction, ProductSalesRpt, StockReport } from '../../core/interfaces/stockReport';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  private apiUrl = `${apiBaseURL}api/SalesOrders/`; // Update with your CIN7 API URL

  constructor(private http: HttpClient) { }

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}`);
  }
  GetCin7OrdersByWoolworth(startDate: Date, endDate: Date, invoiced: any, matched: any, stage: any, rangeFilterType: any, invoiceSent: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetCin7OrdersByWoolworth?startDate=${startDate}&endDate=${endDate}&invoiced=${invoiced}&matched=${matched}&stage=${stage}&rangeFilterType=${rangeFilterType}&invoiceSent=${invoiceSent}`);
  }
  GetCin7OrdersByFoodStuff(startDate: Date, endDate: Date, invoiced: any, matched: any, stage: any, rangeFilterType: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetCin7OrdersByFoodStuff?startDate=${startDate}&endDate=${endDate}&invoiced=${invoiced}&matched=${matched}&stage=${stage}&rangeFilterType=${rangeFilterType}`);
  }
  GetSalesOrderItemsByBranchId(id: any): Observable<BranchOrderItemReport> {
    return this.http.get<BranchOrderItemReport>(`${this.apiUrl}GetSalesOrderItemsByBranchId?branchId=${id}`);
  }
  GetWWSalesOrderItems(): Observable<SalesOrderItemReport[]> {
    return this.http.get<SalesOrderItemReport[]>(`${this.apiUrl}GetWWSalesOrderItems`);
  }
  GetReportForSaleOrderLineItems(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.apiUrl + "GetReportForSaleOrderLineItems", tableQuery);
  }
  GetSalesReportForAWeek(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.apiUrl + "GetSalesReportForAWeek", tableQuery);
  }
  GetReportForSaleOrderLineItemsForCSV(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.apiUrl + "GetReportForSaleOrderLineItemsForCSV", tableQuery);
  }
  GetSalesOrdersByBranchId(id: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetSalesOrdersByBranchId?branchId=${id}`);
  }
  syncSalesOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}SyncSalesOrders`);
  }
  UploadWoolWorthSalesOrders(formData: any, createdDate: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}UploadWoolWorthSalesOrders?createdDate=${createdDate}`, formData);
  }
  SyncSalesOrderToCin7(formData: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}SyncSalesOrderToCin7`, formData);
  }
  GetWoolWorthSalesOrder(): Observable<WoolWorthPO[]> {
    return this.http.get<WoolWorthPO[]>(`${this.apiUrl}GetWoolWorthSalesOrder`);
  }
  UploadFoodStuffSalesOrders(formData: any, createdDate: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}UploadFoodStuffSalesOrders?createdDate=${createdDate}`, formData);
  }
  SyncFoodStuffSalesOrderToCin7(formData: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}SyncFoodStuffSalesOrderToCin7`, formData);
  }
  GetFoodStuffSalesOrder(): Observable<FoodStuffPoDTO[]> {
    return this.http.get<FoodStuffPoDTO[]>(`${this.apiUrl}GetFoodStuffSalesOrder`);
  }
  sendCustomSalesOrderToCin7(formData: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}SendCustomSalesOrderToCin7`, formData);
  }
  SendCustomSalesOrderToCin7FromStore(formData: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}SendCustomSalesOrderToCin7FromStore`, formData);
  }
  UpdateAndSendCustomPo(formData: any): Observable<any> {
    debugger;
    return this.http.post<Observable<any>>(`${this.apiUrl}UpdateAndSendCustomPo`, formData);
  }
  GetSyncedSalesOrderComparison(orderId: any, orderType: any): Observable<ImportFoodStuffOrder> {
    debugger;
    return this.http.get<ImportFoodStuffOrder>(`${this.apiUrl}GetSyncedSalesOrderComparison?orderId=${orderId}&type=${orderType}`);
  }
  GetInvoicedSalesOrders(startDate: Date, endDate: Date): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetInvoicedSalesOrders?startDate=${startDate}&endDate=${endDate}`);
  }
  GetCin7SalesorderStages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetCin7SalesorderStages`);
  }
  sendCashPickup(blob: Blob, toemailAddress: any, name: any) {
    debugger;
    const formData = new FormData();
    formData.append('file', blob, 'filename.ext'); // Adjust filename as needed
    return this.http.post<any>(`${this.apiUrl}SendCashPickupEmail?toemailAddress=${toemailAddress}&name=${name}`, formData).subscribe((data: any) => { }, (error) => { console.log(error) });
  }
  GetAccountSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetAccountSettings`);
  }
  GetSalesDashboardByDateRangeReport(startDate: any, endDate: any): Observable<SalesDashboardByDateRangeReport> {
    return this.http.get<SalesDashboardByDateRangeReport>(`${this.apiUrl}GetSalesDashboardByDateRange?startDate=${startDate}&endDate=${endDate}`);
  }
  GetSalesDashboardHistory(startDate: any, endDate: any, stage: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetSalesDashboardHistory?startDate=${startDate}&endDate=${endDate}&stage=${stage}`);
  }
  GetCustomPoById(guidId: any): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.apiUrl}GetCustomPoById?guidId=${guidId}`);
  }
  RejectCustomPo(guidId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}RejectCustomPo?guidId=${guidId}`);
  }
  GetCustomPurchaseOrders(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.apiUrl + "GetCustomPurchaseOrders", tableQuery);
  }
  CheckDispatchOrderDate(reference: any, customerOrderNo: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}CheckDispatchOrderDate?reference=${reference}&customerOrderNo=${customerOrderNo}`);
  }
  CheckDispatchOrderDateByCustomerPoNo(customerOrderNo: any, storeId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}CheckDispatchOrderDateByCustomerPoNo?cin7storeId=${storeId}&customerOrderNo=${customerOrderNo}`);
  }
  GetSalesOrdersWithPagination(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.apiUrl + "GetSalesOrdersWithPagination", tableQuery);
  }
  GetLast30DaysSalesOrders(isPodUploaded: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetLast30DaysSalesOrders?isPodUploaded=" + isPodUploaded);
  }
  uploadPOD(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}upload-pod`, formData);
  }
  GetNewProductForecastingReport(category: any): Observable<BannerProductPricingReport[]> {
    return this.http.get<BannerProductPricingReport[]>(this.apiUrl + `GetNewProductForecastingReport?category=${category}`);
  }
  GetSettings(): Observable<Setting> {
    return this.http.get<Setting>(this.apiUrl + "GetSettings");
  }
  UpdateSetting(setting: any): Observable<Setting> {
    return this.http.put<any>(this.apiUrl + "UpdateSetting", setting);
  }
  GetNewProductForecastingReportHistory(productOptionId: any): Observable<ProductSales[]> {
    return this.http.get<ProductSales[]>(this.apiUrl + `GetNewProductForecastingReportHistory?productOptionId=${productOptionId}`);
  }
  TrackSalesOrderByCustomerPoNo(poNumber: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + `TrackSalesOrderByCustomerPoNo?customPoNumber=${poNumber}`);
  }
  SendETAPODRequest(salesOrder: any, type: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}SendETAPODRequest?type=${type}`, salesOrder);
  }
  UpdateETAPOD(type: any, salesOrderId: any, fromData: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}UpdateETAPOD?type=${type}&salesOrderId=${salesOrderId}`, fromData);
  }
  GetSalesOrderByGuidId(salesOrderId: any): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.apiUrl}GetSalesOrderByGuidId?salesOrderId=${salesOrderId}`);
  }
  UpdateSalesOrderInvoiceStatus(salesOrderId: any, isSent: any): Observable<any> {
    return this.http.get<Observable<any>>(`${this.apiUrl}UpdateSalesOrderInvoiceStatus?salesOrderId=${salesOrderId}&isSent=${isSent}`);
  }
  sendOnlineSalesOrder(formData: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}SendOnlineSalesOrder`, formData);
  }
  GetETAPODReport(etaPodStatus: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetETAPODReport?etaPodStatus=" + etaPodStatus);
  }
  GetDailySalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetDailySalesLineChart");
  }
  GetWeelkySalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetWeelkySalesLineChart");
  }
  GetMonlthySalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetMonlthySalesLineChart");
  }
  GetDailyProductCategorySalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetDailyProductCategorySalesLineChart");
  }
  GetWeelkyProductCategorySalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetWeelkyProductCategorySalesLineChart");
  }
  GetMonlthyProductCategorySalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetMonlthyProductCategorySalesLineChart");
  }
  GetDailyBannerSalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetDailyBannerSalesLineChart");
  }
  GetWeelkyBannerSalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetWeelkyBannerSalesLineChart");
  }
  GetMonlthyBannerSalesLineChart(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetMonlthyBannerSalesLineChart");
  }
  GetInvoicedSalesOrderReport(startDate: Date, endDate: Date, categoryId: any, invoiceSent: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetInvoicedSalesOrderReport?startDate=${startDate}&endDate=${endDate}&category=${categoryId}&invoiceSent=${invoiceSent}`);
  }
  SendBulkInvoiceEmail(salesOrdeIds: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}SendBulkInvoiceEmail`, salesOrdeIds);
  }
  bulkGeneratePDF(salesOrdeIds: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}BulkGeneratePDF`, salesOrdeIds);
  }
  getInvoiceEmailLogs(salesOrderId: any): Observable<EmailLog[]> {
    return this.http.get<EmailLog[]>(`${this.apiUrl}GetInvoiceEmailLogs?salesOrderId=${salesOrderId}`);
  }
  updateVeganShopOrderStatus(salesOrderId: any, status: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}UpdateVeganShopOrderStatus?salesOrderId=${salesOrderId}&status=${status}`);
  }
  GetVeganshopOrders(tableQuery: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(this.apiUrl + "GetVeganshopOrders", tableQuery);
  }
  UpdateVeganShopOrderStatusByGuidId(salesOrderId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}UpdateVeganShopOrderStatusByGuidId?salesOrderId=${salesOrderId}`);
  }
  GetEmailLogBannerDistribution(startDate: any, endDate: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetEmailLogBannerDistribution?startDate=${startDate}&endDate=${endDate}`);
  }
  GetEmailLogsByBannerId(bannerId: any, isIndependent: any, startDate: any, endDate: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetEmailLogsByBannerId?startDate=${startDate}&endDate=${endDate}&bannerId=${bannerId}&isIndependent=${isIndependent}`);
  }
  GetTodaysOrdersFromCin7(startDate: Date, categoryId: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetTodaysOrdersFromCin7?createdDate=${startDate}&categoryId=${categoryId}`);
  }
  GetLast15DaysSalesOrdersUptoDate(startDate: Date): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetLast15DaysSalesOrdersUptoDate?createdDate=${startDate}`);
  }
  GetProductMonthlySales(filterType: any): Observable<ProductMonthSales[]> {
    debugger;
    return this.http.get<ProductMonthSales[]>(`${this.apiUrl}GetProductMonthlySales?filterType=${filterType}`);
  }
  GetInvoicedSalesOrderReportWithPayment(startDate: Date, endDate: Date, isPaid: any, category: any, isExcludeNotSent: any): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}GetInvoicedSalesOrderReportWithPayment?startDate=${startDate}&endDate=${endDate}&isPaid=${isPaid}&category=${category}&isExcludeNotSent=${isExcludeNotSent}`);
  }
  GetNewProductOrderedByStores(bannerCategoryId: any, startDate: any, endDate: any, productId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetNewProductOrderedByStores?bannerCategoryId=${bannerCategoryId}&startDate=${startDate}&endDate=${endDate}&productId=${productId}`);
  }
  UpdateInvoiceEmail(memberId: any, updatedEmail: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}UpdateInvoiceEmail?memberId=${memberId}&updatedEmail=${updatedEmail}`);
  }

  GetPendingSalesOrdersAsync(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl + "GetPendingSalesOrdersAsync");
  }
  getBatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}GetBatches`);
  }
  GetReconciliationReport(
    startDate: string | null = null,
    endDate: string | null = null,
    productId: number | null = null,
    contactId: number | null = null
  ): Observable<ReconciliationReportDto[]> {
    let params = new HttpParams();

    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);
    if (productId) params = params.append('productId', productId.toString());
    if (contactId) params = params.append('contactId', contactId.toString());

    return this.http.get<ReconciliationReportDto[]>(
      `${this.apiUrl}GetReconciliationReport`,
      { params }
    );
  }

  GetSalesOrdersAsync(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "GetSalesOrdersAsync");
  }


  getSalesOrderDetails(salesOrderId: number): Observable<SalesOrderWithHeaderAndItemsDto> {
    return this.http.get<SalesOrderWithHeaderAndItemsDto>(
      `${this.apiUrl}GetSalesOrderDetails/${salesOrderId}`
    );
  }

  updateDispatchDetails(salesOrderId: number, dispatchData: DispatchUpdateRequest): Observable<any> {
    return this.http.put(
      `${this.apiUrl}UpdateDispatchDetails/${salesOrderId}`,
      dispatchData
    );
  }

   getStockReport(): Observable<StockReport[]> {
    return this.http.get<StockReport[]>(`${this.apiUrl}GetStockReport`);
  }

  getProductWiseProductionReport(productId: number): Observable<ProductProduction[]> {
    return this.http.get<ProductProduction[]>(`${this.apiUrl}GetProductWiseProductionReport/${productId}`);
  }

  getProductWiseSalesReport(productId: number): Observable<ProductSalesRpt[]> {
    return this.http.get<ProductSalesRpt[]>(`${this.apiUrl}GetProductWiseSalesReport/${productId}`);
  }
}
