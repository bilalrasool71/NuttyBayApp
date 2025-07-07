export interface ProductStockLevel {
  productId: number;
  productName: string;
  productCode: string;
  totalUnits: number;
  totalCartons: number;
  batches: BatchStockLevel[];
}

export interface BatchStockLevel {
  productionRunProductId: number;
  batchNo: string;
  unitQuantity: number;
  cartonQuantity: number;
  unitsPerCarton: number;
  productionDate: Date;
  expiryDate?: Date;
  productionRunId: number;
}

export interface StockAdjustmentRequest {
  productId: number;
  productionRunProductId?: number;
  batchNo?: string;
  unitAdjustment: number;
  cartonAdjustment?: number;
  reason: string;
  userId: number;
  isStockTake?: boolean;
}

export interface StockAdjustmentResponse {
  success: boolean;
  message?: string;
  adjustmentId: number;
  newUnitQuantity: number;
  newCartonQuantity: number;
  productId: number;
  batchNo: string;
  adjustmentDate: Date;
}

export interface StockTakeRequest {
  productId: number;
  productionRunProductId?: number;
  batchNo?: string;
  actualUnits: number;
  actualCartons: number;
  notes?: string;
  userId: number;
}

export interface StockTakeResponse {
  success: boolean;
  message?: string;
  adjustmentId: number;
  previousUnitQuantity: number;
  previousCartonQuantity: number;
  newUnitQuantity: number;
  newCartonQuantity: number;
  productId: number;
  batchNo: string;
  stockTakeDate: Date;
}

export interface StockAdjustmentHistory {
  adjustmentId: number;
  productId: number;
  productName: string;
  batchNo: string;
  unitAdjustment: number;
  cartonAdjustment: number;
  previousUnitQuantity: number;
  newUnitQuantity: number;
  reason: string;
  adjustmentDate: Date;
  userName: string;
  isStockTake: boolean;
}

export interface StockTakeHistory {
  stockTakeId: number;
  productId: number;
  productName: string;
  batchNo: string;
  systemUnitQuantity: number;
  systemCartonQuantity: number;
  actualUnitQuantity: number;
  actualCartonQuantity: number;
  adjustedUnitQuantity: number;
  adjustedCartonQuantity: number;
  notes: string;
  stockTakeDate: Date;
  userName: string;
}