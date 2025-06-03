export interface PurchaseOrderItemsReport {
    reference: string;
    purchaseOrderId:number;
    poCode:string;
    code: string;
    name: string;
    qty: number;
    dispatchIn?: number | null;
    receiveIn?: number | null;
    stockAvailable:number;
    stockOnHand:number;
    holdingStock:number;
    productionDate: Date;
    dispatchDate: Date;
    receivingDate: Date;
    estimatedDeliveryDate:Date;
  }

  export interface PurchaseOrderItemsGroupReport{
    code:string;
    name:String;
    stockAvailable:number;
    stockOnHand:number;
    holdingStock:number;
    incomingStock:number;
    purchaseOrderItemsReports:PurchaseOrderItemsReport[];
  }