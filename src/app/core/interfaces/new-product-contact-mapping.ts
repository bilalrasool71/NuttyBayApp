import { Product } from "./product";

export interface NewProductContactMapping {
    bannerId?: number;
    clusterId?: number;
    clusterSizeId?: number;
    products:Product[];
}