import { Product } from "./product";

export interface AllBannersSalesReport {
    totalValue?: number;
    totalQty?: number;
    totalGP?: number;
    totalRate?: number;
    totalCoreGAPS:number;
    totalRecommendedGAPS:number;
    totalRecommendedSalesOpp:number;
    totalCoreSalesOpp:number;
    products: Product[];
  }
