export interface ProductContactMatrix {
  contactName: string;
  storeId: number;
  bannerId: number;
  productCodes: { [key: string]: string };
}


export interface ProductStatus {
  status: number;
  lastOrderedDate: string;
  onBoardDate:string;
  code:string;
  lastAvailibilityDate:string;
  gapStatus:string;
}

export interface StoreAvailabilityReport {
  storeName: string;
  storeId: number;
  cin7StoreId:number;
  productOptionId:number;
  bannerId: number;
  availableCount: number;
  products: {
    [key: string]: ProductStatus
  };
}