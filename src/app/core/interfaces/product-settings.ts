export interface StoreRangeViewModel {
    contactId: number;
    storeName: string;
    isSelected: boolean;
    selectedRange: string;
}

export interface UpdateSingleProductContactRequest {
  productId: number;
  store: StoreRangeViewModel;
}