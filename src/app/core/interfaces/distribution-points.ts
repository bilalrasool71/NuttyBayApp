import { ProductDistributionPoint } from "./product-distribution-point";
import { StoreDistributionPoint } from "./store-distribution-point";

export interface DistributionPoints {
  allStoreDistributionPointsDTOs: StoreDistributionPoint[];
  productDistributionPointsDTOs: ProductDistributionPoint[];
}
