export interface HoldRequest {
  productId: number;
  productionRunProductId: number;
  batchNo: string;
  quantity: number;
  cartonQuantity: number;
  reason: string;
  userId: number;
  isUnitHold: boolean;
}

export interface InventoryHold {
  holdId: number;
  productId: number;
  productName: string;
  productionRunProductId: number;
  batchNo: string;
  quantity: number;
  cartonQuantity: number;
  reason: string;
  holdDate: Date;
  userId: number;
  userName: string;
  isActive: boolean;
  isUnitHold: boolean;
}