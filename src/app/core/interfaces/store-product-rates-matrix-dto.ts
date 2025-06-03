import { ContactEntity } from "./contact";
import { Product } from "./product";

export interface StoreProductRatesMatrixDTO{
    contact:ContactEntity;
    product:Product;
    totalQty:number;
    daysItems:{ [key: number]: number }
}