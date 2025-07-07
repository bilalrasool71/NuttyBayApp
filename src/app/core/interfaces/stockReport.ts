export interface StockReport {
    productId: number;
    productName: string;
    qtyIn: number;
    qtyOut: number;
    stockInHand: number;
    productionReturns: number;
    salesReturns: number;

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