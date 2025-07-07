import { BannerCategorySales } from "./banner-category-sales";

export interface Product {
    id?: number;
    code?: string;
    name?: string;
    company?:string;
    description?: string;
    weight?: number;
    category?: string;
    article?: string;
    articleNo?: string;
    vendorNumber?: string;
    ean?: string;
    codeValue?:string;
    qty?:string;
    value?:number;
    rate?:number;
    average ?: number;
    gp?:number;
    gaps:number;
    gapValue?:number;
    qtyNumber?:number;
    productContactId?:number;
    totalStoresHavingOrders?:number
    totalStoresNotHavingOrders?:number
    averageQty?:number
    averageValue?:number
    averageGP?:number
    averageRate?:number
    totalStores?:number
    havingRangingCompliance?:boolean
    isRanged?:boolean
    isSohLow?:boolean
    isDeleted?:boolean
    price?: number;
    stockInHand?: number;
    unit?: number;
    bannerCategorySales?:BannerCategorySales[]
}

