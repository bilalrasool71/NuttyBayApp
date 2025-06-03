export interface StoreProductStockCheckerLogsDTO {
    bannerCategoryId: number;
    bannerCategoryName: string;
    name: string;
    code: string;
    company: string;
    countTotalStores: number;
    productOptionId: number;
    syncedStoresCount: number;
    syncedDate: Date; // or string if you're receiving ISO date strings
  }
  