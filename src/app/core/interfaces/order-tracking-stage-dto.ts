export interface OrderTrackingStageDTO {
    orderTrackStageId: number;
    orderTrackStageName: string;
    isSent: boolean;
    sentDate?: Date ;
    uploadedDate?: Date;
    isAcknowledged: boolean;
    acknowledgementDate: Date | null;
    isCompleted: boolean;
    isActive: boolean;
    invoiceMatched: number;
    poNumberMatched: number;
    orderQtyMatched: number;
    totalLineItemsMatched: number;
    totalOrders: number;
    totalLineItems: number;
    invoiceNoMatchedCount?: number;
    poNumberMatchedCount?: number;
    orderedQtyMatchedCount?: number;
    lineItemsMatchedCount?: number;
    providaAccountMatchedCount?: number;
    totalInvoiceNo?: number;
    totalPoNumber?: number;
    totalOrderedQty?: number;
    totalProvidaAccount?: number;
    enumId?:number;
    sequenceNo?:number;
    fileName?:string;
    fileURL?:string
  }