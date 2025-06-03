import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseURL } from '../../core/constant/constant';
import { Banner } from '../../core/interfaces/banner';
import { BannerProductPricingReport } from '../../core/interfaces/banner-product-pricing-report';
import { BannerSalesByProduct } from '../../core/interfaces/banner-sales-report';
import { IndependentBanner } from '../../core/interfaces/independent-banner';
import { SalesOrderItemReport } from '../../core/interfaces/sale-order-item-report';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  baseURL = `${apiBaseURL}api/Banner/`;
  constructor(private http: HttpClient) { }
  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.baseURL);
  }
  getBannersByBannerCategoryId(bannerCategoryId: any): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.baseURL}GetBannersByBannerCategoryId?bannerCategoryId=${bannerCategoryId}`);
  }
  getIndependentBanners(): Observable<IndependentBanner[]> {
    return this.http.get<IndependentBanner[]>(`${this.baseURL}GetIndependentBanners`);
  }
  getBannerById(id: any): Observable<Banner> {
    return this.http.get<Banner>(`${this.baseURL}${id}`);
  }
  GetBannerProductPricingReport(displayStatus: any, category: any): Observable<BannerProductPricingReport[]> {
    return this.http.get<BannerProductPricingReport[]>(`${this.baseURL}GetBannerProductPricingReport?displayStatus=${displayStatus}&category=${category}`);
  }
  GetBannerSalesByProduct(name: any, startDate: any, endDate: any): Observable<BannerSalesByProduct[]> {
    debugger
    return this.http.get<BannerSalesByProduct[]>(`${this.baseURL}GetBannerSalesByProduct?name=${name}&startDate=${startDate}&endDate=${endDate}`);
  }
  GetProductSalesByBannerId(name: any, bannerId: any, isIndependent: any, storeId: any, startDate: any, endDate: any): Observable<SalesOrderItemReport[]> {
    return this.http.get<SalesOrderItemReport[]>(`${this.baseURL}GetProductSalesByBannerId?name=${name}
      &bannerId=${bannerId}&isIndependent=${isIndependent}&storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`);
  }
}
