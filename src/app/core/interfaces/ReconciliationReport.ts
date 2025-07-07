export interface ReconciliationReportDto {
    productName: string;
    company: string;
    contactId: number | null;
    transactionType: string;
    quantity: number;
    validBatch: string;
    transactionDate: string;
    referenceNumber: string;
    notes: string;
    isProduction: string;
    transactionId: number;
    batchNo: string;
}