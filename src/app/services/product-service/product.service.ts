import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseURL } from '../../core/constant/constant';
import { AngelFoodAndFoodStuffProductComparison } from '../../core/interfaces/angel-food-foodStuff-product-comparison';
import { DDLCin7Product } from '../../core/interfaces/ddl-cin7-product';
import { Product } from '../../core/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL = `${apiBaseURL}api/Product`;
  constructor(private http: HttpClient) { }
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseURL);
  }
  getProductIById(id: any): Observable<Product> {
    return this.http.get<Product>(`${this.baseURL}/${id}`);
  }
  getCin7Products(priceTier: any, category: any): Observable<DDLCin7Product[]> {
    return this.http.get<DDLCin7Product[]>(`${this.baseURL}/GetCin7Products?priceTier=${priceTier}&category=${category}`);
  }
  getAllCin7Products(): Observable<DDLCin7Product[]> {
    return this.http.get<DDLCin7Product[]>(`${this.baseURL}/getAllCin7Products`);
  }
  GetAllDisplayableCin7Products(): Observable<DDLCin7Product[]> {
    return this.http.get<DDLCin7Product[]>(`${this.baseURL}/GetAllDisplayableCin7Products`);
  }
  syncCin7Products(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/SyncCin7Products`);
  }
  getComparisonOfAngelFoodAndFoodStuffProducts(): Observable<AngelFoodAndFoodStuffProductComparison[]> {
    return this.http.get<AngelFoodAndFoodStuffProductComparison[]>(`${this.baseURL}/getComparisonOfAngelFoodAndFoodStuffProducts`);
  }
  updateProductSettings(product: DDLCin7Product[]): Observable<any> {
    return this.http.put<any>(`${this.baseURL}/UpdateProductSettings`, product);
  }
  
  GetAllProductsByTierWisePricing(contactId: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseURL}/GetAllProductsByTierWisePricing?contactId=${contactId}`);
  }
}
