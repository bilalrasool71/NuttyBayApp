export interface StockReport {
    productId: number;
    productName: string;
    stockInHand: number;
    stockInHandCartons: number | null;
    qtyIn: number;
    qtyOut: number;
    productionReturns: number;
    salesReturns: number;
    stockAdjustmentOut: number;
    stockAdjustmentIn: number;
    cartonIn: number | null;
    cartonOut: number | null;
    productionReturnsCarton: number | null;
    salesReturnsCarton: number | null;
    stockAdjustmentOutCarton: number | null;
    stockAdjustmentInCarton: number | null;
}

export interface ProductSalesRpt {
    productId: number;
    productName: string;
    soldQty: number;
    company: string;
    date: string;
    referenceNumber: string;
    unit: number | null;
}

export interface ProductProduction {
    productId: number;
    productName: string;
    producedQty: number;
    batchNo: string;
    date: string;
    batchSize: number;
    productionRunId: number | null;
    unit: number | null;
}